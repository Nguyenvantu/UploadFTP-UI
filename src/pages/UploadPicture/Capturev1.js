import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Button } from "reactstrap";
import * as FileSaver from "file-saver";
import toastr from "toastr";
// import imageCompression from "browser-image-compression";
import moment from "moment";

import { postFromData, post } from "../../helpers/api_helper";
import { CONTAINER } from "../../helpers/url_helper";
import { useUploadConfig } from "../../helpers/hook";
import { checkISOContainer, drawImageText, to2num } from "../../utils";
import PictureList from "./PictureList";

const MAX_UI_WIDTH = 632;
const ASPECT_RATIO = 1.33;
const IMG_MIN_WIDTH = 632;
const IMG_MIN_HEIGHT = 840;

const UploadPicture = () => {
  const videoRef = useRef();
  const inputRef = useRef();

  const [id, setId] = useState("");
  const [temp, setTemp] = useState("");
  const [saving, setSaving] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [torch, setTorch] = useState(false);
  const config = useUploadConfig();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          device => device.kind === "videoinput"
        );

        const media = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: videoDevices[videoDevices.length - 1].deviceId,
            facingMode: "environment",
            height: { min: IMG_MIN_HEIGHT },
            width: { min: IMG_MIN_WIDTH },
            aspectRatio: ASPECT_RATIO,
          },
        });

        videoRef.current.srcObject = media;
        videoRef.current.play();
      } catch (e) {
        console.error(e);
        toastr.error("Không thể truy cập camera!");
      }
    })();
  }, [id]);

  const onRemove = useCallback(file => {
    setPictures(prevPics => prevPics.filter(pic => pic !== file));
  }, []);

  const onTakePicture = async () => {
    const mediastream = videoRef.current.srcObject;
    const track = mediastream.getVideoTracks()[0];
    const settings = track.getSettings();

    const canvas = document.createElement("canvas");
    canvas.width = settings.width;
    canvas.height = settings.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, settings.width, settings.height);
    const currentLength = pictures.length;

    canvas.toBlob(async blob => {
      const fileName = `${id}-${moment().format("MMDDHHmmss")}-${to2num(
        currentLength + 1
      )}.jpg`;
      const file = new File([blob], fileName);

      const newFile = await drawImageText(file, config, fileName);

      setPictures(pics => {
        return [...pics, newFile];
      });
    }, "image/jpeg");
  };

  const onChangeFlashStatus = e => {
    setTorch(prevT => {
      const mediastream = videoRef.current && videoRef.current.srcObject;
      if (mediastream) {
        const tracks = mediastream.getVideoTracks();
        const track = tracks[0];
        const hasTorch = track.getCapabilities().torch;
        if (hasTorch) {
          track.applyConstraints({
            advanced: [
              {
                torch: !prevT,
              },
            ],
          });
        }
      }
      return !prevT;
    });
  };

  const saveLocal = () => {
    pictures.forEach((pic, i) => {
      const fileName = `${id}-${moment(pic.lastModifiedDate).format(
        "MMDDHHmmss"
      )}-${to2num(i + 1)}.jpg`;
      FileSaver.saveAs(pic, fileName);
    });
  };

  const saveServer = async () => {
    setSaving(true);

    const container = await post(`${CONTAINER}`, { id })
      .then(res => res.data)
      .catch(() => null);

    if (!container) {
      toastr.error("Tạo Container thất bại! Vui lòng thử lại sau!");
      setSaving(false);
      return;
    }

    const errors = [];

    await Promise.all(
      pictures.map((pic, i) => {
        const fileName = `${id}-${moment(pic.lastModifiedDate).format(
          "MMDDHHmmss"
        )}-${to2num(i + 1)}.jpg`;

        const form = new FormData();
        form.append("id", id);
        form.append("file", pic, fileName);

        return postFromData("/upload/v2", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then(data => {
            if (!data.success) {
              return Promise.reject(data);
            }
          })
          .catch(err => {
            console.error(err);
            errors.push(i);
          });
      })
    );

    setSaving(false);

    if (errors.length) {
      toastr.error("Có lỗi xảy ra ở các ảnh sau, Vui lòng thử lại!");
      setPictures(pictures.filter((p, i) => errors.includes(i)));
    } else {
      setPictures([]);
      toastr.success("Lưu thành công!");
    }
  };

  const uploadPicture = async e => {
    e.preventDefault();

    const newFiles = Array.from(e.target.files).filter(file =>
      file.type.includes("image/")
    );

    const compressedFiles = await Promise.all(
      newFiles.map(file => drawImageText(file, config))
    );

    setPictures(prevFiles => [...prevFiles, ...compressedFiles]);

    e.target.value = "";
  };

  const onCodeChange = e => {
    const value = (e.target.value || "").toUpperCase().trim();
    if (value && value.length > 11) return;

    setTemp(value);
    if (!value) {
      setId("");
    }
  };

  const onSelectCode = e => {
    const isISO = checkISOContainer(temp);
    if (!isISO) {
      const ok = window.confirm(
        "ISO container chưa đúng. Bạn có muốn tiếp tục?"
      );
      if (ok) {
        setId(temp);
        setTemp("");
      }
    } else {
      setId(temp);
      setTemp("");
    }
  };

  return (
    <>
      <div
        className="page-content"
        style={{
          maxWidth: MAX_UI_WIDTH,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "10px",
        }}
      >
        <div className="d-flex">
          <Input
            placeholder="CONTAINER ID"
            value={temp || id}
            onChange={onCodeChange}
            style={{ fontSize: 20, fontWeight: 500, color: "#000" }}
          />
          <Button
            className="btn-info"
            style={{ marginLeft: 8 }}
            disabled={!temp || temp.length < 11}
            onClick={onSelectCode}
          >
            Chọn
          </Button>
        </div>

        <div className={`m-auto ${id ? "" : "d-none"}`}>
          <div className="w-100 d-flex mt-2">
            <video
              autoPlay
              playsInline
              className="w-100"
              ref={videoRef}
              style={{ background: "#cfcfcf" }}
            />
          </div>
          {saving ? (
            <h5 className="w-100 text-center">Đang tải ảnh, vui lòng chờ!</h5>
          ) : (
            <>
              <div
                className="d-flex justify-content-center mt-2"
                style={{ columnGap: 10 }}
              >
                <Button
                  className="btn-danger"
                  style={{ width: 120 }}
                  onClick={() => onTakePicture()}
                >
                  <i className="fa fa-camera"></i> Chụp
                </Button>{" "}
                <Button
                  className="btn-warning"
                  onClick={() => onChangeFlashStatus()}
                >
                  <i className="fa fa-bolt"></i> {!torch ? "Bật" : "Tắt"} Flash
                </Button>{" "}
                <Button
                  className="btn-warning"
                  onClick={() => inputRef.current.click()}
                >
                  <i className="fa fa-folder-open"></i> Chọn từ máy
                </Button>
              </div>
              {pictures.length > 0 && (
                <div
                  className="d-flex justify-content-center mt-2"
                  style={{ columnGap: 10 }}
                >
                  <Button className="btn-info" onClick={saveLocal}>
                    <i className="fa fa-download"></i> Lưu lên máy
                  </Button>{" "}
                  <Button className="btn-success" onClick={saveServer}>
                    <i className="fa fa-cloud-upload-alt"></i> Lưu lên server
                  </Button>
                </div>
              )}
            </>
          )}
          <div className="mt-2">
            <PictureList items={pictures} onRemove={onRemove} />
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        onChange={uploadPicture}
        type="file"
        accept="image/*"
        className="d-none"
        multiple
      />
    </>
  );
};

export default UploadPicture;

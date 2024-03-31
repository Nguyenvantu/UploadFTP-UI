/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useCallback, useEffect } from "react";
import { Row, Input, Button, Col } from "reactstrap";
import * as FileSaver from "file-saver";
import { useHistory } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import toastr from "toastr";
import { io } from "socket.io-client";

import {
  checkISOContainer,
  drawImageText,
  to2num,
  base64ToFile,
} from "../../utils";
import {
  postFromData,
  get,
  post,
  // API_URL,
  WS_URL,
} from "../../helpers/api_helper";
import { CONTAINER } from "../../helpers/url_helper";
import { useUploadConfig, useCamera } from "../../helpers/hook";
import PictureList from "./PictureList";

const CODE_LENGTH = 11;

const UploadPicture = () => {
  // const captureRef = useRef();
  const uploadRef = useRef();

  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pictures, setPictures] = useState([]);
  const [selectedCamera, setCamera] = useState(0);
  const [isCamView, setIsCamView] = useState(false);
  const config = useUploadConfig();

  useEffect(() => {
    if (pictures.length === 0) {
      setIsCamView(true);
    }
  }, [pictures]);

  const onTakePicture = async () => {
    if (!isCamView) {
      return setIsCamView(true);
    }
    const doc = document.querySelector("#camera-view");
    if (doc && doc.src) {
      const fileName = `${code}-${moment().format("MMDDHHmmss")}-${to2num(
        pictures.length + 1
      )}.jpg`;
      // const base64Str = doc.src.replace("data:image/jpeg;base64,");

      // const newFile = new File(
      //   [Uint8Array.from(atob(base64Str), m => m.codePointAt(0))],
      //   fileName,
      //   { type: "image/jpeg" }
      // );

      const newFile = base64ToFile(doc.src, fileName);

      // const newFile = new File(
      //   Buffer.from(doc.src.replace("data:image/jpeg;base64,"), "base64"),
      //   fileName
      // );

      setPictures(prevFiles => [...prevFiles, newFile]);
    }
  };

  const onRemove = useCallback(file => {
    setPictures(prevPics => prevPics.filter(pic => pic !== file));
  }, []);

  const saveLocal = () => {
    pictures.forEach((pic, i) => {
      const fileName = `${code}-${moment(pic.lastModifiedDate).format(
        "MMDDHHmmss"
      )}-${to2num(i + 1)}.jpg`;
      FileSaver.saveAs(pic, fileName);
    });
  };

  const saveServer = async () => {
    setSaving(true);
    const errors = [];

    const container = await post(`${CONTAINER}`, {
      id: code,
    })
      .then(res => res.data)
      .catch(() => null);

    if (!container) {
      toastr.error("Tạo Container thất bại! Vui lòng thử lại sau!");
      setSaving(false);
      return;
    }

    await Promise.all(
      pictures.map((pic, i) => {
        const fileName = `${code}-${moment(pic.lastModifiedDate).format(
          "MMDDHHmmss"
        )}-${to2num(i + 1)}.jpg`;

        const form = new FormData();
        form.append("id", code);
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
    if (value && value.length > CODE_LENGTH) return;
    setCode(value);

    if (value.length === CODE_LENGTH) {
      const isISO = checkISOContainer(value);
      if (!isISO) {
        const ok = window.confirm(
          "ISO container chưa đúng. Bạn có muốn tiếp tục?"
        );
        if (ok) {
          // captureRef.current.click();
        }
      }
    }
  };

  const onCameraChange = e => {
    setCamera(parseInt(e.target.value));
    setIsCamView(true);
  };

  const onPicView = () => {
    setIsCamView(v => !v);
  };

  const isValidCode = code.length === CODE_LENGTH;

  return (
    <>
      <div className="page-content camera-layout">
        <div className={`w-100 box-view`}>
          <>
            {saving && (
              <h5 className="w-100 text-center">Đang tải ảnh, vui lòng chờ!</h5>
            )}
            {isCamView && selectedCamera ? (
              <CameraView id={selectedCamera} setLoading={setLoading} />
            ) : (
              <PictureList items={pictures} onRemove={onRemove} />
            )}
          </>
        </div>
        <div className="box-control">
          {!!pictures.length && (
            <div className="mb-2">
              Đã chụp <b>{pictures.length}</b> ảnh{" "}
              <a href="#" onClick={onPicView} className="text-blue">
                {isCamView ? "Xem ảnh" : "Chụp tiếp"}
              </a>
            </div>
          )}
          <div className="mb-2">
            <CameraSelect onChange={onCameraChange} value={selectedCamera} />
          </div>
          <div className="box-input mb-2">
            <Input
              placeholder="CONTAINER ID"
              value={code}
              onChange={onCodeChange}
            />
            <Button
              className="btn-danger"
              onClick={onTakePicture}
              disabled={!isValidCode || (isCamView ? loading : !isValidCode)}
            >
              <i className="fa fa-camera"></i> Chụp
            </Button>
          </div>
          <div>
            <Row className="gx-1">
              <Col className="pr-1">
                <Button
                  className="btn w-100 h-100"
                  style={{ padding: "10px 4px", fontSize: 12 }}
                  onClick={saveServer}
                  disabled={!pictures.length}
                >
                  <i className="fa fa-cloud-upload-alt"></i> Lưu lên server
                </Button>
              </Col>
              <Col className="pr-1">
                <QuickViewUploaded code={code} />
              </Col>
              <Col className="px-1">
                <Button
                  className="btn w-100 h-100"
                  onClick={saveLocal}
                  disabled={!pictures.length}
                  style={{ padding: "10px 4px", fontSize: 12 }}
                >
                  <i className="fa fa-download"></i> Lưu lên máy
                </Button>
              </Col>
              <Col className="pl-1">
                <Button
                  className="btn w-100 h-100"
                  style={{ padding: "10px 4px", fontSize: 12 }}
                  onClick={() => uploadRef.current.click()}
                >
                  <i className="fa fa-folder-open"></i> Chọn từ máy
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <input
        ref={uploadRef}
        onChange={uploadPicture}
        type="file"
        className="d-none"
        accept="image/*"
        multiple
      />
      {/* <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={captureRef}
        onChange={uploadPicture}
        className="d-none"
      /> */}
    </>
  );
};

function CameraView({ id, setLoading }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    console.log(WS_URL);
    const socket = io(`${WS_URL}/camera?id=${id}`);

    socket.on("data", function (data) {
      setSrc("data:image/jpeg;base64," + data);
      if (setLoading) setLoading(false);
    });
    socket.on("error", function (err) {
      console.log(err);
    });

    return () => {
      socket.disconnect();
      if (setLoading) setLoading(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="h-100 w-100 text-center">
      <img
        alt=""
        id="camera-view"
        //   src={`${API_URL}${CAMERA}/${id}/view`}
        src={src}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}

function CameraSelect(props) {
  const [data] = useCamera();

  return (
    <select className="form-control" {...props}>
      <option key={0} value={0}>
        -- Chọn Camera --
      </option>
      {_.map(data, c => {
        return (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        );
      })}
    </select>
  );
}

function QuickViewUploaded({ code }) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onViewUploaded = async () => {
    if (!code) return;

    setLoading(true);
    const { data } = await get(`${CONTAINER}`, {
      params: {
        container: code,
      },
    });
    setLoading(false);

    if (!data || !data.length) {
      toastr.error("Container không tồn tại!");
    } else {
      history.push(`/container/${data[0].id}`);
    }
  };

  return (
    <Button
      className="btn w-100 h-100"
      style={{ padding: "10px 4px", fontSize: 12 }}
      onClick={onViewUploaded}
      disabled={!code}
    >
      {loading ? (
        "Đang tải..."
      ) : (
        <>
          <i className="fas fa-eye"></i> Xem nhanh
        </>
      )}
    </Button>
  );
}

export default UploadPicture;

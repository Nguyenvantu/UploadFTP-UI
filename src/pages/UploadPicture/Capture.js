import { useState, useRef, useCallback } from "react";
import { Row, Input, Button, Col } from "reactstrap";
import * as FileSaver from "file-saver";
import { useHistory } from "react-router-dom";
import moment from "moment";
import toastr from "toastr";

import { checkISOContainer, drawImageText, to2num } from "../../utils";
import { postFromData, get, post } from "../../helpers/api_helper";
import { CONTAINER } from "../../helpers/url_helper";
import { useUploadConfig } from "../../helpers/hook";
import PictureList from "./PictureList";

const CODE_LENGTH = 11;
const SIZE_LENGTH = 2;
const TYPE_LENGTH = 2;
const CACHE = new Map();

const UploadPicture = () => {
  const captureRef = useRef();
  const uploadRef = useRef();

  const [code, setCode] = useState("");
  // const [size, setSize] = useState("");
  // const [type, setType] = useState("");
  const [saving, setSaving] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const config = useUploadConfig();

  const onTakePicture = () => {
    captureRef.current.click();
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
    if (!code) {
      toastr.error("Vui lòng nhập Container ID!");
      return;
    }

    const isISO = checkISOContainer(code);
    if (!isISO) {
      const ok = window.confirm(
        "ISO container chưa đúng. Bạn có muốn tiếp tục?"
      );
      if (!ok) {
        return;
      }
    }

    setSaving(true);

    const errors = [];

    const container = await post(`${CONTAINER}`, {
      id: code,
      // size,
      // type,
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

  const detectCode = async pic => {
    if (CACHE.has(pic)) {
      const data = CACHE.get(pic);

      if (data && data.data && data.data.code) {
        setCode(data.data.code);
      }

      return;
    }

    try {
      setDetecting(true);

      const form = new FormData();

      form.append("file", pic, pic.name);

      const data = await postFromData("/upload/detect", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      CACHE.set(pic, data);

      if (data.success) {
        const { size, type, code } = data.data;
        // setSize(size);
        // setType(type);
        setCode(code);

        // if (code) {
        //   const isISO = checkISOContainer(code);
        //   if (!isISO) {
        //     const ok = window.confirm(
        //       "ISO container chưa đúng. Bạn có muốn tiếp tục?"
        //     );
        //     if (!ok) {
        //       setCode("");
        //     }
        //   }
        // }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetecting(false);
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

    const pics = [...pictures, ...compressedFiles];

    setPictures(pics);

    if (!code) {
      detectCode(pics[0]);
    }

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
          captureRef.current.click();
        }
      }
    }
  };

  // const onSizeChange = e => {
  //   const value = (e.target.value || "").toUpperCase().trim();
  //   if (value && value.length > SIZE_LENGTH) return;
  //   setSize(value);
  // };

  // const onTypeChange = e => {
  //   const value = (e.target.value || "").toUpperCase().trim();
  //   if (value && value.length > TYPE_LENGTH) return;
  //   setType(value);
  // };

  // const disabled = !!code && code.length !== CODE_LENGTH;

  return (
    <>
      <div className="page-content camera-layout">
        <div className={`w-100 box-view`}>
          <div>
            {saving && (
              <h5 className="w-100 text-center">Đang tải ảnh, vui lòng chờ!</h5>
            )}
            <PictureList items={pictures} onRemove={onRemove} />
          </div>
        </div>
        <div className="box-control">
          <div className="box-input mb-2">
            <div style={{ position: "relative" }}>
              <Input
                placeholder="CONTAINER ID"
                value={code}
                onChange={onCodeChange}
                disabled={detecting}
                style={{
                  paddingRight: detecting ? "40px" : undefined,
                  opacity: detecting ? 0.7 : 1,
                }}
              />
              {detecting && (
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#007bff",
                  }}
                >
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
              )}
            </div>
            <Button
              className="btn-danger"
              onClick={onTakePicture}
              // disabled={disabled}
            >
              <i className="fa fa-camera"></i> Chụp
            </Button>
          </div>
          {/* <div className="box-input mb-2">
            <Row className="gx-1">
              <Col>
                <Input
                  placeholder="SIZE"
                  value={size}
                  onChange={onSizeChange}
                  maxLength={SIZE_LENGTH}
                />
              </Col>
              <Col>
                <Input
                  placeholder="TYPE"
                  value={type}
                  onChange={onTypeChange}
                  maxLength={TYPE_LENGTH}
                />
              </Col>
            </Row>
          </div> */}
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
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={captureRef}
        onChange={uploadPicture}
        className="d-none"
      />
    </>
  );
};

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

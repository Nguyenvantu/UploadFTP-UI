import { useState, useRef } from "react";
import { Spinner, Row, Button, Col } from "reactstrap";
import _ from "lodash";
import moment from "moment";
import toastr from "toastr";
import { saveAs } from "file-saver";

import { postFromData, post } from "../../helpers/api_helper";
import { CONTAINER } from "../../helpers/url_helper";
import { useContainer, useUploadConfig } from "../../helpers/hook";
import PictureList from "../UploadPicture/PictureList";
import { drawImageText, to2num } from "../../utils";

const ContainerDetail = ({ match }) => {
  const captureRef = useRef();
  const uploadRef = useRef();

  const [uploading, setUploading] = useState(false);

  const [data, loading, fetchData] = useContainer(match.params.id);
  const config = useUploadConfig();

  const code = _.get(data, "container");

  const onTakePicture = () => {
    captureRef.current.click();
  };

  const saveLocal = () => {
    _.forEach(data && data.files, file => {
      saveAs(file.url, file.name);
    });
  };

  const uploadPicture = async e => {
    if (!code) {
      return;
    }

    e.preventDefault();
    setUploading(true);

    const newFiles = Array.from(e.target.files).filter(file =>
      file.type.includes("image/")
    );
    const compressedFiles = await Promise.all(
      newFiles.map(file => drawImageText(file, config))
    );

    const container = await post(`${CONTAINER}`, {
      id: code,
    })
      .then(res => res.data)
      .catch(() => null);

    if (!container) {
      e.target.value = "";
      setUploading(false);
      toastr.error("Tạo Container thất bại! Vui lòng thử lại sau!");
      return;
    }

    const errors = [];
    const currentLength = _.get(data, "files.length", 0);

    await Promise.all(
      compressedFiles.map((pic, i) => {
        const form = new FormData();

        const fileName = `${code}-${moment(pic.lastModifiedDate).format(
          "MMDDHHmmss"
        )}-${to2num(currentLength + i + 1)}.jpg`;
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

    setUploading(false);
    e.target.value = "";
    fetchData();

    if (errors.length) {
      toastr.error("Có lỗi xảy ra, Vui lòng thử lại!");
    } else {
      toastr.success("Lưu thành công!");
    }
  };

  return (
    <div className="page-content p-0">
      <div className="main-layout">
        <div>
          {loading ? (
            <div className="text-center mt-2">
              <Spinner />
            </div>
          ) : (
            <div className="">
              <PictureList items={_.get(data, "files") || []} />
            </div>
          )}
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
          <div className="box-control" style={{ height: "auto" }}>
            <div>
              <div className="mb-2">
                <h5 className="mb-1">
                  Container ID: <b>{_.get(data, "container", "")}</b>
                </h5>
                <div>Số lượng ảnh: {_.get(data, "files.length", "")}</div>
              </div>
              <Row className="gx-1">
                <Col className="pr-1">
                  <Button
                    className="btn-danger w-100 h-100"
                    onClick={onTakePicture}
                    disabled={uploading || loading}
                    style={{ padding: "10px 4px", fontSize: 12 }}
                  >
                    {uploading ? (
                      <>Đang tải...</>
                    ) : (
                      <>
                        <i className="fa fa-camera"></i> Chụp
                      </>
                    )}
                  </Button>
                </Col>
                <Col className="px-1">
                  <Button
                    className="btn w-100 h-100"
                    onClick={saveLocal}
                    disabled={loading}
                    style={{ padding: "10px 4px", fontSize: 12 }}
                  >
                    <i className="fa fa-download"></i> Lưu về máy
                  </Button>
                </Col>
                <Col className="pl-1">
                  <Button
                    className="btn w-100 h-100"
                    style={{ padding: "10px 4px", fontSize: 12 }}
                    onClick={() => uploadRef.current.click()}
                    disabled={loading}
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
      </div>
    </div>
  );
};

export default ContainerDetail;

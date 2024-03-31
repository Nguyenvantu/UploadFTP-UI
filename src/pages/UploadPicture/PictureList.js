import { useState, memo } from "react";
import { Row, Col, Modal, ModalHeader } from "reactstrap";
import _ from "lodash";

function PictureList({ items, onRemove }) {
  const [preview, setPreview] = useState("");

  const toggleImgModal = () => {
    setPreview("");
  };

  return (
    <>
      <Modal isOpen={!!preview} toggle={toggleImgModal} centered>
        <ModalHeader toggle={toggleImgModal}></ModalHeader>
        <img src={preview} onClick={toggleImgModal} className="w-100" alt="" />
      </Modal>
      <Row className="gx-1">
        {_.reverse([...items]).map(pic => {
          return (
            <PreviewPicture
              key={pic.name || pic.id}
              file={pic}
              onPreview={setPreview}
              onRemove={onRemove}
            />
          );
        })}
      </Row>
    </>
  );
}

const PreviewPicture = memo(({ file, onPreview, onRemove }) => {
  const src = file instanceof File ? URL.createObjectURL(file) : file.url;

  const onRemoveClick = e => {
    e.preventDefault();
    onRemove(file);
  };

  return (
    <Col xs="6" sm="6" md="4" key={src} className="mb-1">
      <div className="position-relative" style={{ paddingTop: "60%" }}>
        <div
          className="w-100 h-100"
          style={{ position: "absolute", top: 0, background: "#dedede" }}
        >
          <img
            src={src}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            alt=""
            onClick={() => onPreview(src)}
          />
          {!!onRemove && (
            <button
              onClick={onRemoveClick}
              className="position-absolute btn"
              style={{ right: 0, top: 0, padding: "3px 6px" }}
            >
              <i className="fa fa-trash text-danger"></i>
            </button>
          )}
        </div>
      </div>
    </Col>
  );
});

export default memo(PictureList);

import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  // FormGroup,
  // Spinner,
  // Label,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
} from "reactstrap";
// import moment from "moment";
// import queryString from "query-string";
import _ from "lodash";
import toastr from "toastr";

import Form from "./CameraDetail";
import { del } from "../../helpers/api_helper";
import { CAMERA } from "../../helpers/url_helper";

const CamList = ({ groupId, cameras, fetchData }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const onCreate = () => {
    setOpen(true);
    setData({});
  };

  const onUpdate = data => {
    setOpen(true);
    setData(data);
  };

  const toggleModal = () => {
    setOpen(o => !o);
  };

  const onDelete = cam => async e => {
    e.stopPropagation();

    const ok = window.confirm(`Xác nhận xoá camera này ?`);
    if (ok) {
      try {
        const data = await del(`${CAMERA}/${cam.id}`);

        if (data.success) {
          toastr.success("Xoá dữ liệu thành công!");
          fetchData();
        } else {
          toastr.error(data.message || "Có lỗi xảy ra!");
        }
      } catch (e) {
        console.error(e);
        toastr.error("Có lỗi xảy ra vui lòng thử lại sau!");
      }
    }
  };

  return (
    <div>
      {open && (
        <Modal isOpen={true} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>
            <h5>{!data.id ? "Tạo nhóm mới" : `Cập nhật thông tin nhóm`}</h5>
          </ModalHeader>
          <ModalBody>
            <Form
              data={data}
              groupId={groupId}
              toggleModal={toggleModal}
              fetchData={fetchData}
            />
          </ModalBody>
        </Modal>
      )}
      {/*  */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-3">Danh sách Camera</h5>
        <Button onClick={onCreate}>Tạo mới</Button>
      </div>
      <div className="mt-2">
        <Table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Url</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {_.map(cameras, (c, i) => {
              return (
                <tr key={c.id} onClick={() => onUpdate(c)}>
                  <th scope="row">{i + 1}</th>
                  <td>{c.name}</td>
                  <td>
                    {c.url}:{c.port}
                  </td>
                  {/* <td>{moment(c.created_at).format("DD/MM/YYYY HH:mm")}</td> */}
                  <td>
                    <span style={{ color: "#ff715b" }} onClick={onDelete(c)}>
                      Xoá
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CamList;

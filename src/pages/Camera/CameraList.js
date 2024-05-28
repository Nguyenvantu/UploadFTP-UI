import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  // ModalHeader,
  // ModalBody,
  // FormGroup,
  // Spinner,
  // Label,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
} from "reactstrap";
import moment from "moment";
// import queryString from "query-string";
import _ from "lodash";

import Form from "./CameraDetail";

const CamList = ({ groupId, cameras }) => {
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

  return (
    <div>
      {open && (
        <Modal isOpen={true} toggle={toggleModal} centered>
          {/* <ModalHeader toggle={toggle}></ModalHeader> */}
          {/* <ModalBody> */}
          <Form data={data} groupId={groupId} toggleModal={toggleModal} />
          {/* </ModalBody> */}
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
              <th>#</th>
              <th>Tên cam</th>
              <th>Url</th>
              <th>Ngày tạo</th>
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
                  <td>{moment(c.created_at).format("DD/MM/YYYY HH:mm")}</td>
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

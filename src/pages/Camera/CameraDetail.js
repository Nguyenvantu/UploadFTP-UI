// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastr from "toastr";

import { post, put } from "../../helpers/api_helper";
import { CAMERA } from "../../helpers/url_helper";

function CameraForm({ data, groupId, toggleModal, fetchData }) {
  const isCreate = !data.id;

  const onValidSubmit = async (e, values) => {
    e.preventDefault();
    try {
      values.groupId = groupId;

      const rs = isCreate
        ? await post(CAMERA, values)
        : await put(`${CAMERA}/${data.id}`, values);

      if (rs.success) {
        toastr.success("Lưu thành công!");
        toggleModal();
        fetchData();
      } else {
        toastr.success(rs.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      toastr.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <div>
        {/* <div className="d-flex align-items-center justify-content-between mb-3">
          <h5>{isCreate ? "Tạo nhóm mới" : `Cập nhật thông tin nhóm`}</h5>
          <span>
            <i className=""></i>
          </span>
        </div> */}
        <AvForm
          className="form-horizontal"
          onValidSubmit={onValidSubmit}
          model={data}
        >
          <div className="mb-2">
            <AvField
              name="name"
              label="Tên"
              value=""
              className="form-control"
              placeholder="Nhập tên"
              required
            />
          </div>
          <div className="mb-2">
            <AvField
              name="url"
              label="Url"
              value=""
              className="form-control"
              placeholder="Nhập Url"
              required
            />
          </div>
          <div className="mb-2">
            <AvField
              name="port"
              label="Cổng"
              value=""
              className="form-control"
              placeholder="Nhập cổng"
              required
            />
          </div>
          <div className="mb-2">
            <AvField
              name="username"
              label="Username"
              value=""
              className="form-control"
              placeholder="Nhập username"
            />
          </div>
          <div className="mb-2">
            <AvField
              name="password"
              label="Password"
              value=""
              className="form-control"
              placeholder="Nhập password"
            />
          </div>
          <div className="mt-3 d-flex align-items-center justify-content-between gap-10">
            <button
              className="btn btn-primary w-100 waves-effect waves-light"
              type="submit"
            >
              {isCreate ? "Tạo" : "Lưu"}
            </button>
          </div>
        </AvForm>
      </div>
    </div>
  );
}

export default CameraForm;

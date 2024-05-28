// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastr from "toastr";

import { post, put } from "../../helpers/api_helper";
import { CAMERA } from "../../helpers/url_helper";

function CameraForm({ data, groupId, toggleModal }) {
  const isCreate = !data.id;

  const onValidSubmit = async (e, values) => {
    e.preventDefault();
    try {
      values.groupId = groupId;

      if (isCreate) {
        const data = await post(CAMERA, values);
        if (data.success) {
          toastr.success("Lưu thành công!");
        } else {
          toastr.success(data.message || "Có lỗi xảy ra!");
        }
        return;
      }

      const rs = await put(`${CAMERA}/${data.id}`, values);
      if (rs.success) {
        toastr.success("Lưu thành công!");
        toggleModal();
      } else {
        toastr.success(rs.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      toastr.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <div className="main-layout">
        <div>
          <h5 className="mb-3">
            {isCreate ? "Tạo nhóm mới" : `Cập nhật thông tin nhóm`}
          </h5>
        </div>
        <AvForm
          className="form-horizontal"
          onValidSubmit={onValidSubmit}
          model={data}
        >
          <div className="mb-3">
            <AvField
              name="name"
              label="Tên camera"
              value=""
              className="form-control"
              placeholder="Nhập tên"
              required
            />
          </div>
          <div className="mb-3">
            <AvField
              name="url"
              label="Url"
              value=""
              className="form-control"
              placeholder="Nhập Url"
              required
            />
          </div>
          <div className="mb-3">
            <AvField
              name="port"
              label="Cổng"
              value=""
              className="form-control"
              placeholder="Nhập cổng"
              required
            />
          </div>
          <div className="mb-3">
            <AvField
              name="username"
              label="Username"
              value=""
              className="form-control"
              placeholder="Nhập username"
            />
          </div>
          <div className="mb-3">
            <AvField
              name="password"
              label="Password"
              value=""
              className="form-control"
              placeholder="Nhập password"
            />
          </div>
          <div className="mt-3">
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

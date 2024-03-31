import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastr from "toastr";

import { getDepartments } from "../../store/actions";
import { useUser } from "../../helpers/hook";
import { post, put } from "../../helpers/api_helper";
import { USER } from "../../helpers/url_helper";

const User = ({ match }) => {
  const id = match.params.id;

  const isCreate = id === "create";

  if (isCreate) return <CreateUser />;
  return <DetailUser id={id} />;
};

function DetailUser({ id }) {
  const [data, loading] = useUser(id);

  return data && data.id ? (
    <UserForm defaultValues={data} />
  ) : (
    <Spinner loading={loading} />
  );
}

function CreateUser() {
  return <UserForm isCreate />;
}

function UserForm({ isCreate, defaultValues }) {
  const history = useHistory();

  const dispatch = useDispatch();
  const departments = useSelector(state => state.Department.data);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const onValidSubmit = async (e, values) => {
    e.preventDefault();
    try {
      if (isCreate) {
        const data = await post(USER, values);
        if (data.success) {
          toastr.success("Lưu thành công!");
          history.push(`/user`);
        } else {
          toastr.success(data.message || "Có lỗi xảy ra!");
        }
        return;
      }

      const data = await put(`${USER}/${defaultValues.id}`, values);
      if (data.success) {
        toastr.success("Lưu thành công!");
      } else {
        toastr.success(data.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      toastr.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="page-content p-0">
      <div className="main-layout">
        <div>
          <h5 className="mb-3">
            {isCreate ? "Tạo mới tài khoản" : `Cập nhật tài khoản`}
          </h5>
        </div>
        <AvForm
          className="form-horizontal"
          onValidSubmit={onValidSubmit}
          model={defaultValues}
          // onInvalidSubmit={onInvalidSubmit}
        >
          {/* {error && <Alert color="danger">{error}</Alert>} */}
          <div className="mb-3">
            <AvField
              name="username"
              label="Tên người dùng"
              value=""
              disabled={!isCreate}
              className="form-control"
              placeholder="Nhập tên người dùng"
              required
            />
          </div>
          <div className="mb-3">
            <AvField
              type="select"
              name="departmentId"
              label="Nhóm"
              // helpMessage="Idk, this is an example. Deal with it!"
            >
              {departments.map(de => (
                <option key={de.id} value={de.id}>
                  {de.name}
                </option>
              ))}
            </AvField>
          </div>
          <div className="mb-3">
            <AvField
              name="password"
              label="Mật khấu"
              value=""
              // type="password"
              className="form-control"
              required={!!isCreate}
              placeholder="Nhập mật khẩu"
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

export default User;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastr from "toastr";

import { getDepartments } from "../../store/actions";
import { useUser } from "../../helpers/hook";
import { post, put } from "../../helpers/api_helper";
import { CAMERA_GROUP } from "../../helpers/url_helper";

const CameraGroup = ({ match }) => {
  const id = match.params.id;

  const isCreate = id === "create";

  if (isCreate) return <CreateGroup />;
  return <DetailGroup id={id} />;
};

function DetailGroup({ id }) {
  const [data, loading] = useUser(id);

  return data && data.id ? (
    <GroupForm defaultValues={data} />
  ) : (
    <Spinner loading={loading} />
  );
}

function CreateGroup() {
  return <GroupForm isCreate />;
}

function GroupForm({ isCreate, defaultValues }) {
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
        const data = await post(CAMERA_GROUP, values);
        if (data.success) {
          toastr.success("Lưu thành công!");
          history.push(`/user`);
        } else {
          toastr.success(data.message || "Có lỗi xảy ra!");
        }
        return;
      }

      const data = await put(`${CAMERA_GROUP}/${defaultValues.id}`, values);
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
            {isCreate ? "Tạo nhóm mới" : `Cập nhật thông tin nhóm`}
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
              name="name"
              label="Tên nhóm"
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
              required
              // helpMessage="Idk, this is an example. Deal with it!"
            >
              {departments.map(de => (
                <option key={de.id} value={de.id}>
                  {de.name}
                </option>
              ))}
            </AvField>
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

export default CameraGroup;

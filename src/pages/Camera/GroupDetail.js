import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastr from "toastr";

import { getDepartments } from "../../store/actions";
import { useCameraGroup } from "../../helpers/hook";
import { post, put, del } from "../../helpers/api_helper";
import { CAMERA_GROUP } from "../../helpers/url_helper";
import CameraList from "./CameraList";

const CameraGroup = ({ match }) => {
  const id = match.params.id;

  const isCreate = id === "create";

  if (isCreate) return <CreateGroup />;
  return <DetailGroup id={id} />;
};

function DetailGroup({ id }) {
  const [data, loading, fetchData] = useCameraGroup(id);

  return data && data.id ? (
    <GroupForm defaultValues={data} fetchData={fetchData} />
  ) : (
    <Spinner loading={loading} />
  );
}

function CreateGroup() {
  return <GroupForm isCreate />;
}

function GroupForm({ isCreate, defaultValues, fetchData }) {
  const [loading, setLoading] = useState(false);

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
          history.replace(
            window.location.pathname.replace("create", data.data.id)
          );
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

  const onDel = async () => {
    const ok = window.confirm(
      `Xác nhận xoá nhóm này, danh sách camera cũng sẽ bị xoá theo. Bạn chắc chắn muốn xoá ?`
    );
    if (ok) {
      try {
        setLoading(true);
        const data = await del(`${CAMERA_GROUP}/${defaultValues.id}`);
        setLoading(false);

        if (data.success) {
          toastr.success("Xoá dữ liệu thành công!");
          history.goBack();
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
    <div className="page-content p-0">
      <div className="main-layout">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5>{isCreate ? "Tạo nhóm mới" : `Cập nhật thông tin nhóm`}</h5>
          <button
            className="btn btn-danger waves-effect waves-light mr-2"
            onClick={onDel}
          >
            Xoá
          </button>
        </div>
        <AvForm
          className="form-horizontal"
          onValidSubmit={onValidSubmit}
          model={defaultValues}
          // onInvalidSubmit={onInvalidSubmit}
        >
          <div className="mb-3">
            <AvField
              name="name"
              label="Tên nhóm"
              value=""
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
              value=""
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
          <div className="mt-3 text-center">
            <button
              className="btn btn-primary  waves-effect waves-light"
              type="submit"
            >
              {isCreate ? "Tạo" : "Lưu"}
            </button>
          </div>
        </AvForm>
        {!!defaultValues && !!defaultValues.id && (
          <div className="mt-3">
            <CameraList
              cameras={defaultValues.cameras}
              groupId={defaultValues.id}
              fetchData={fetchData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraGroup;

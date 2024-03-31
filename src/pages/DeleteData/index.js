import { useState } from "react";
import { FormGroup, Spinner, Label, Alert } from "reactstrap";
import moment from "moment";
import toastr from "toastr";

import DatePicker from "../../components/Common/DatePicker";
import { del } from "../../helpers/api_helper";
import { CONTAINER } from "../../helpers/url_helper";

const DeleteData = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const [end, setEnd] = useState(
    moment().add(-30, "day").endOf("day").toDate()
  );

  const onDelete = async () => {
    const ok = window.confirm(
      `Xoá tất cả dữ liệu trước ${moment(end).format(
        "DD/MM/Y HH:mm"
      )}. Bạn có muốn tiếp tục?`
    );
    if (ok) {
      try {
        setLoading(true);
        const data = await del(`${CONTAINER}?to=${end.toISOString()}`);
        setLoading(false);

        if (data.success) {
          toastr.success("Xoá dữ liệu thành công!");
          setResponse(data.data);
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
        <div>
          <h5 className="mb-3">Xoá dữ liệu</h5>
          <div className="d-flex align-items-center">
            <FormGroup>
              <Label>Xoá tất cả dữ liệu trước ngày</Label>
              <DatePicker value={end} onChange={setEnd} />
            </FormGroup>
          </div>
          {!!response && (
            <Alert color="success" className="mt-2">
              <div>Số lượng Containers đã xoá: {response.container}</div>
              <div>Số lượng ảnh đã xoá: {response.file}</div>
            </Alert>
          )}
          <div className="text-center mt-2">
            {loading ? (
              <Spinner />
            ) : (
              <button
                className="btn btn-primary  waves-effect waves-light"
                onClick={onDelete}
              >
                Xoá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteData;

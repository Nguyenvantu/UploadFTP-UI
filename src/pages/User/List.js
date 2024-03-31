import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Spinner, Button } from "reactstrap";
import moment from "moment";
import _ from "lodash";

import { getUsers } from "../../store/actions";

const UserList = () => {
  const user = useSelector(state => state.User);
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="page-content p-0">
      <div className="main-layout">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5>Danh sách users</h5>
            <Link to={`/user/create`}>
              <Button>Tạo mới</Button>
            </Link>
          </div>
          {user.loading ? (
            <div className="text-center mt-2">
              <Spinner />
            </div>
          ) : (
            <div className="mt-2">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Nhóm</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {user.data.map((c, i) => {
                    return (
                      <tr key={c.id}>
                        <th scope="row">{i + 1}</th>
                        <td>
                          <Link to={`/user/${c.id}`}>{c.username}</Link>
                        </td>
                        <td>{_.get(c.department, "name")}</td>
                        <td>
                          {moment(c.created_at).format("DD/MM/YYYY HH:mm")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;

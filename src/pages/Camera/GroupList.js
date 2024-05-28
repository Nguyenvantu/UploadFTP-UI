import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Spinner,
  // Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import moment from "moment";
// import queryString from "query-string";
import _ from "lodash";

import { getCameraGroups } from "../../store/actions";
// import DatePicker from "../../components/Common/DatePicker";

const ContainerList = () => {
  const [page, setPage] = useState(1);

  const cameraGroup = useSelector(state => state.CameraGroup);
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    dispatch(getCameraGroups());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="page-content p-0">
      <div className="main-layout">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-3">Danh sách nhóm Camera</h5>
            <Link to={`/manage/group/create`}>
              <Button>Tạo mới</Button>
            </Link>
          </div>
          {cameraGroup.loading ? (
            <div className="text-center mt-2">
              <Spinner />
            </div>
          ) : (
            <div className="mt-2">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên nhóm</th>
                    <th>Số lượng cam</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(_.chunk(cameraGroup.data, 10)[page - 1], (c, i) => {
                    return (
                      <tr key={c.id}>
                        <th scope="row">{(page - 1) * 10 + i + 1}</th>
                        <td>
                          <Link to={`/manage/group/${c.id}`}>{c.name}</Link>
                        </td>
                        <td>{_.get(c.cameras, "length")}</td>
                        <td>
                          {moment(c.created_at).format("DD/MM/YYYY HH:mm")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <PanigationContainer
                page={page}
                onChange={setPage}
                total={cameraGroup.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PanigationContainer({ total = 0, page = 1, onChange, pageSize = 10 }) {
  if (!total) return null;

  const last = Math.ceil(total / pageSize) || 1;

  const pages = (
    page <= 3 ? [1, 2, 3, 4, 5] : [page - 2, page - 1, page, page + 1, page + 2]
  ).filter(p => p <= last);

  return (
    <div className="text-end">
      <Pagination>
        <PaginationItem onClick={() => onChange(1)}>
          <PaginationLink first />
        </PaginationItem>
        <PaginationItem onClick={() => onChange(Math.max(1, page - 1))}>
          <PaginationLink href="#" previous />
        </PaginationItem>
        {pages.map(current => {
          const active = page === current;
          return (
            <PaginationItem
              key={current}
              active={active}
              onClick={() => onChange(current)}
            >
              <PaginationLink href="#">{current}</PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem onClick={() => onChange(Math.min(last, page + 1))}>
          <PaginationLink href="#" next />
        </PaginationItem>
        <PaginationItem onClick={() => onChange(last)}>
          <PaginationLink href="#" last />
        </PaginationItem>
      </Pagination>
    </div>
  );
}

export default ContainerList;

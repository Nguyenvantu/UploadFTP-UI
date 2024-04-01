import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  FormGroup,
  Spinner,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import moment from "moment";
import queryString from "query-string";
// import _ from "lodash";

import { getContainers } from "../../store/actions";
import DatePicker from "../../components/Common/DatePicker";

const ContainerList = ({ location }) => {
  const [page, setPage] = useState(1);

  const container = useSelector(state => state.Container);
  const dispatch = useDispatch();

  const [start, setStart] = useState(moment().startOf("date").toDate());
  const [end, setEnd] = useState(moment().endOf("date").toDate());

  const { keyword } = queryString.parse(location.search);

  const fetchData = useCallback(() => {
    const limit = 10;
    const filter = {
      offset: (page - 1) * limit,
      limit,
      keyword,
    };
    if (!keyword) {
      filter.from = start;
      filter.to = end;
    }
    dispatch(getContainers(filter));
  }, [dispatch, start, end, keyword, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="page-content p-0">
      <div className="main-layout">
        <div>
          <h5 className="mb-3">Danh sách containers</h5>
          {!keyword && (
            <div className="d-flex align-items-center" style={{ gap: 6 }}>
              <FormGroup className="w-50">
                <Label for="examplePassword">Bắt đầu</Label>
                <DatePicker value={start} onChange={setStart} />
              </FormGroup>
              <FormGroup className="w-50">
                <Label for="examplePassword">Kết thúc</Label>
                <DatePicker value={end} onChange={setEnd} />
              </FormGroup>
            </div>
          )}
          {container.loading ? (
            <div className="text-center mt-2">
              <Spinner />
            </div>
          ) : (
            <div className="mt-2">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Container ID</th>
                    <th>Số lượng</th>
                    <th>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {container.data.map((c, i) => {
                    return (
                      <tr key={c.id}>
                        <th scope="row">{(page - 1) * 10 + i + 1}</th>
                        <td>
                          <Link to={`/container/${c.id}`}>{c.container}</Link>
                        </td>
                        <td>{c.totalFiles}</td>
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
                total={container.total}
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

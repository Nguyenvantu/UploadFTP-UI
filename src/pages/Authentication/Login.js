import React, { useEffect } from "react";
import { Row, Col, Alert, Container } from "reactstrap";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// actions
import { loginUser } from "../../store/actions";
// import images
import logo from "../../assets/images/logo-sm-dark.png";

const Login = ({ history }) => {
  const { error, isLoggedIn } = useSelector(state => state.Login);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  if (isLoggedIn) return <Redirect to="/" />;

  // handleValidSubmit
  const handleValidSubmit = (e, values) => {
    e.preventDefault();
    dispatch(loginUser(values, history));
  };

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="card overflow-hidden">
              <div className="bg-login text-center">
                <div className="bg-login-overlay"></div>
                <div className="position-relative">
                  {/* <h5 className="text-white font-size-20">Hệ thống lưu ảnh</h5> */}
                  <p className="text-white-50 mb-0">Đăng nhập để tiếp tục</p>
                  <Link to="/" className="logo logo-admin mt-4">
                    <img src={logo} alt="" height="30" />
                  </Link>
                </div>
              </div>
              <div className="card-body pt-5">
                <div className="p-2">
                  <AvForm
                    className="form-horizontal"
                    onValidSubmit={handleValidSubmit}
                  >
                    {error && typeof error === "string" ? (
                      <Alert color="danger">{error}</Alert>
                    ) : null}

                    <div className="mb-3">
                      <AvField
                        name="username"
                        label="Tên người dùng"
                        value=""
                        className="form-control"
                        placeholder="Nhập tên người dùng"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <AvField
                        name="password"
                        label="Mật khấu"
                        value=""
                        type="password"
                        required
                        placeholder="Nhập mật khẩu"
                      />
                    </div>

                    <div className="mt-3">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light"
                        type="submit"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </AvForm>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Login);

import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// users
import user4 from "../../../assets/images/logo-sm.png";
import { logoutUser } from "../../../store/actions";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const user = useSelector(state => state.Login.user);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect px-1"
          id="page-header-user-dropdown"
          tag="button"
        >
          {/* <img
            className="rounded-circle header-profile-user"
            src={user4}
            alt="Header Avatar"
          />{" "} */}
          <div className="d-xl-inline-block">{user.username}</div>
          {/* <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>{" "} */}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem>
            <Link to={"/container"} className="d-flex align-items-center">
              <i className="fas fa-images font-size-16 me-2"></i>{" "}
              <span>Xem ảnh đã gửi</span>
            </Link>
          </DropdownItem>
          {user.role === "ADMIN" && (
            <DropdownItem>
              <Link to={"/user"} className="d-flex align-items-center">
                <i className="fas fa-users font-size-16 me-2"></i>{" "}
                <span>Danh sách tài khoản</span>
              </Link>
            </DropdownItem>
          )}
          {user.role === "ADMIN" && (
            <DropdownItem>
              <Link to={"/deleteData"} className="d-flex align-items-center">
                <i className="fas fa-database font-size-16 me-2"></i>{" "}
                <span>Xoá dữ liệu</span>
              </Link>
            </DropdownItem>
          )}
          <DropdownItem divider />
          <DropdownItem>
            <span
              onClick={logout}
              className="text-danger d-flex align-items-center"
            >
              <i className="bx bx-power-off font-size-16 me-2"></i>{" "}
              <span>Đăng xuất</span>
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
};

export default ProfileMenu;

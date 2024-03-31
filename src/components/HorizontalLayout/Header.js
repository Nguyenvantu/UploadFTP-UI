import { useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { InputGroup, Input, Button } from "reactstrap";
import _ from "lodash";

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions";
// Import menuDropdown
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

// import logo from "../../assets/images/logo-sm.png";
// import logoLight from "../../assets/images/logo-light.png";
// import logoDark from "../../assets/images/logo-dark.png";
// import Navbar from "./Navbar";

//i18n

const Header = props => {
  const history = useHistory();
  // const [search, setSearch] = useState("");

  // function toggleFullscreen() {
  //   if (
  //     !document.fullscreenElement &&
  //     /* alternative standard method */ !document.mozFullScreenElement &&
  //     !document.webkitFullscreenElement
  //   ) {
  //     // current working methods
  //     if (document.documentElement.requestFullscreen) {
  //       document.documentElement.requestFullscreen()
  //     } else if (document.documentElement.mozRequestFullScreen) {
  //       document.documentElement.mozRequestFullScreen()
  //     } else if (document.documentElement.webkitRequestFullscreen) {
  //       document.documentElement.webkitRequestFullscreen(
  //         Element.ALLOW_KEYBOARD_INPUT
  //       )
  //     }
  //   } else {
  //     if (document.cancelFullScreen) {
  //       document.cancelFullScreen()
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen()
  //     } else if (document.webkitCancelFullScreen) {
  //       document.webkitCancelFullScreen()
  //     }
  //   }
  // }

  // const logo = (
  //   <i
  //     className="fa fa-home"
  //     style={{ color: "#fff", fontSize: 18 }}
  //     aria-hidden="true"
  //   ></i>
  // );

  // const onChange = e => {
  //   setSearch(e.target.value);
  // };

  const onSearch = e => {
    e.preventDefault();

    const keyword = _.trim(_.get(e, "target[0].value"));
    // if (!keyword) return;
    history.push(`/container?keyword=${keyword}`);
  };

  return (
    <>
      <div className="navbar-header">
        <div className="d-flex px-2">
          {/* <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">{logo}</span>
              <span className="logo-lg">{logo}</span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">{logo}</span>
              <span className="logo-lg">{logo}</span>
            </Link>
          </div> */}

          <div className="d-flex align-items-center px-2">
            <NavLink
              to="/v1"
              style={{ color: "#787878" }}
              activeClassName="text-white"
            >
              <span className="">V1</span>
            </NavLink>
          </div>
          <div className="d-flex align-items-center px-2">
            <NavLink
              to="/"
              exact
              style={{ color: "#787878" }}
              activeClassName="text-white"
            >
              <span className="">V2</span>
            </NavLink>
          </div>
          <div className="d-flex align-items-center px-2">
            <NavLink
              to="/camera"
              exact
              style={{ color: "#787878" }}
              activeClassName="text-white"
            >
              <span className="">cctv</span>
            </NavLink>
          </div>
        </div>
        <form onSubmit={onSearch}>
          <InputGroup size="sm">
            <Input
              className="form-control-sm"
              placeholder="Nhập từ khoá"
              name="keyword"
              // value={search}
              // onChange={onChange}
            />
            <Button type="submit">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </form>
        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2"></div>
          <ProfileMenu />
        </div>
      </div>
    </>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header));

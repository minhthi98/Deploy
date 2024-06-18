import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import logo from "../../../../assets/images/logoYumhub.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as faBellRegular, faUser } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faCog, faBars } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../contexts/UserContext";
import Dialog from "../Dialog";

const cx = classNames.bind(styles);

function Header() {
  const { user } = useContext(UserContext);
  const [showDialog, setShowDialog] = useState(false);

  const handleEmployeeClick = (e) => {
    if (user.position !== "manager") {
      e.preventDefault();
      setShowDialog(true);
    }
  };

  return (
    <header className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <button className={cx("search-btn")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("icon")} />
        </button>
        <nav className={cx("menu")}>
          <Link to="/menu" className={cx("menu-btn")}>
            <FontAwesomeIcon icon={faBars} className={cx("icon")} />
            <p className={cx("textHeader")}>Menu</p>
          </Link>
          <Link to="/settings" className={cx("setting-btn")}>
            <FontAwesomeIcon icon={faCog} className={cx("icon")} />
            <p className={cx("textHeader")}>Settings</p>
          </Link>
          <Link to="/employee" className={cx("employee-btn")} onClick={handleEmployeeClick}>
            <FontAwesomeIcon icon={faUser} className={cx("icon")} />
            <p className={cx("textHeader")}>Employee</p>
          </Link>
        </nav>
        <div className={cx("right")}>
          <button className={cx("notification-btn")}>
            <FontAwesomeIcon icon={faBellRegular} className={cx("icon")} />
          </button>
          <div className={cx("profile")}>
            <img
              src={user ? user.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj30rv2Vdg9loKSSeT0j7S5ga-ZevdBRDp9Q&s"}
              alt="Profile"
              className={cx("profile-img")}
            />
            <div className={cx("profile-info")}>
              <p className={cx("profile-name")}>{user ? user.fullName : ""}</p>
              <p className={cx("profile-position")}>{user ? user.position : ""}</p>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <Dialog
          title="Warning"
          message="You do not have permission to access this item. Contact admin for more details"
          onClose={() => setShowDialog(false)}
        />
      )}
    </header>
  );
}

export default Header;

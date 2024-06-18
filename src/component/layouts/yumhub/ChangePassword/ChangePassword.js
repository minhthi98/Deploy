import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AxiosInstance from "../../../../utils/AxiosInstance";
import { UserContext } from "../../../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarListen, faEye } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./ChangePassword.module.scss";

const cx = classNames.bind(styles);

function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const idUser = user._id;

      const response = await AxiosInstance.post(
        `admin/changePass/?id=${idUser}`,
        {
          passOld: password,
          passNew: newPassword,
        }
      );
      if (response.data.result) {
        alert("Change Password Success");
        navigate("/home");
      } else {
        alert("Change Password Fail");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cx("container")}>
      <div className={cx("wrapper-box")}>
        <p className={cx("title")}>Change Your Password</p>
        <div className={cx("line")} />
        <div className={cx("wrapper-password")}>
          <p className={cx("text-password")}>Password</p>
          <input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cx("input")}
          />
          <FontAwesomeIcon icon={faEarListen} className={cx("icon")} />
        </div>
        <div className={cx("wrapper-password")}>
          <p className={cx("text-password")}>New Password</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={cx("input")}
          />
          <FontAwesomeIcon icon={faEye} className={cx("icon")} />
        </div>
        <div className={cx("wrapper-password")}>
          <p className={cx("text-password")}>Confirm Password</p>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cx("input")}
          />
          <FontAwesomeIcon icon={faEye} className={cx("icon")} />
        </div>
        <div className={cx("btn-set-password")}>
          <button className={cx("btn")} onClick={handleSubmit}>
            Set Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

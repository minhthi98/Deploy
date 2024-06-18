import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { UserContext } from "../../../contexts/UserContext";
import AxiosInstance, { setAuthToken } from "../../../../utils/AxiosInstance";
import Button from "../../../buttons/index";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import icon_username from "../../../../assets/images/iconUsername.png";
import icon_password from "../../../../assets/images/iconPassword.png";
import cricle from "../../../../assets/images/icon_circle.png";
import eye from "../../../../assets/images/icon_eye.png";

const cx = classNames.bind(styles);
function Login() {
  let navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { loginUser } = useContext(UserContext);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // Biểu thức chính quy để kiểm tra email hợp lệ
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    setIsEmailValid(emailPattern.test(value));
  };

  const handleSubmit = async () => {
    try {
      const response = await AxiosInstance.post("admin/loginAdmin", {
        userName,
        password,
      });
      loginUser(response.data.data.admin);
      const token = response.data.data.token;
      setAuthToken(token);

      if (response.data.result === true) {
        navigate("/home");
      } else {
        alert("Đăng nhập thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cx("container")}>
      <div className={cx("leftBackground")}>
        <div className={cx("logoContainer")}>
          <div className={cx("logo")}>
            <img src={logo} alt="Logo YumHub" width={95} height={98} />
            <p className={cx("textLogo")}>YumHub</p>
          </div>
          <div>
            <p className={cx("slogen")}>
              Opportunities don't happen, you create them
            </p>
          </div>
        </div>
        <div className={cx("title")}>
          <p className={cx("textTitle")}>Get Your Food Delivered Home</p>
        </div>
      </div>
      <div className={cx("rightBackground")}>
        <div>
          <p className={cx("titleLogin")}>TIME TO CONNERT</p>
        </div>
        <div className={cx("enterInfo")}>
          <img src={icon_username} alt="Username" className={cx("iconStart")} />
          <input
            type="text"
            placeholder="lv.hoang610@gmail.com"
            value={userName}
            onChange={handleEmailChange}
          />
          {isEmailValid && (
            <img src={cricle} alt="Circle" className={cx("iconEnd")} />
          )}
        </div>
        <div className={cx("enterInfo")}>
          <img src={icon_password} alt="Password" className={cx("iconStart")} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="lv.hoang0610"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={eye}
            alt="Cricle"
            className={cx("iconEnd")}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <div className={cx("btnLogin")}>
          <Button login onClick={handleSubmit}>
            LOGIN
          </Button>
        </div>
        <div className={cx("rememberPassword")}>
          <p className={cx("textRemember")}>Don't remember your password ? </p>
          <Link to="/forgetPassword" className={cx("textReset")}>
            Reset it now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

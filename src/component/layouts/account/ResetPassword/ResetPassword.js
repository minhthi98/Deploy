import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./ResetPassword.module.scss";
import eye from "../../../../assets/images/icon_eye.png";
import icon_password from "../../../../assets/images/iconPassword.png";
import icon_newpassword from "../../../../assets/images/iconNewPassword.png";
import logo from "../../../../assets/images/logoYumhub.png";
import background from "../../../../assets/images/backgroundResetPassword.png";
import AxiosInstance from "../../../../utils/AxiosInstance";

const cx = classNames.bind(styles);

function ResetPassword() {
  let navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);

  const handleSubmit = async () => {
    if (password === newPassword) {
      try {
        const response = await AxiosInstance.post("admin/resetPass", {
          email: username,
          password: password,
        });
        if (response.data.result === true) {
          navigate("/");
        } else {
          alert("Reset Password Fail");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("No Duplicate Passwords");
    }
  };

  const toggolePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggolePasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };
  return (
    <div className={cx("container")}>
      <div className={cx("leftBackground")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" width={95} height={98} />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <div>
          <p className={cx("title")}>Set New Password</p>
        </div>
        <div>
          <p className={cx("note")}>
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>
        </div>
        <div className={cx("enterInfo")}>
          <img src={icon_password} alt="Pasword" className={cx("iconStart")} />
          <input
          className={cx('input')}
            type={showPassword ? "text" : "password"}
            placeholder="7789BM6X@@H&$K_"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={eye}
            alt="Cricle"
            className={cx("iconEnd")}
            onClick={toggolePassword}
          />
        </div>
        <div className={cx("enterInfo")}>
          <img
            src={icon_newpassword}
            alt="Username"
            className={cx("iconStart")}
          />
          <input
            type={showPasswordNew ? "text" : "password"}
            placeholder="7789BM6X@@H&$K_"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <img
            src={eye}
            alt="Cricle"
            className={cx("iconEnd")}
            onClick={toggolePasswordNew}
          />
        </div>
        <div className={cx("btnSummit")}>
          <Button login forget_btn onClick={handleSubmit}>
            SUMMIT
          </Button>
        </div>
        <div className={cx("btnBackLogin")}>
          <Link to="/" className={cx("no-underline")}>
            <Button backLogin forget_btn>
              BACK TO LOGIN
            </Button>
          </Link>
        </div>
      </div>
      <div className={cx("rightBackground")}>
        <img
          src={background}
          alt="ForgetPassword"
          className={cx("background")}
        ></img>
      </div>
    </div>
  );
}

export default ResetPassword;

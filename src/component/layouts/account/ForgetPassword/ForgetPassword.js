import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AxiosInstance from "../../../../utils/AxiosInstance";
import background from "../../../../assets/images/backgroundForgetPassword.png";
import cricle from "../../../../assets/images/icon_circle.png";
import classNames from "classnames/bind";
import styles from "./ForgetPassword.module.scss";
import icon_username from "../../../../assets/images/iconUsername.png";
import logo from "../../../../assets/images/logoYumhub.png";
import Button from "../../../buttons";

const cx = classNames.bind(styles);

function ForgetPassword() {
  let navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await AxiosInstance.post("admin/forgetPassByEmail", {
        email: username,
      });
      if (response.data.result === true) {
        navigate("/otp",  { state: { username } });
      
      } else {
        alert("Incorrect email!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [username, setUsername] = useState("");
  return (
    <div className={cx("container")}>
      <div className={cx("leftBackground")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" width={95} height={98} />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <div>
          <p className={cx("title")}>FORGOT YOUR PASSWORD ?</p>
        </div>
        <div>
          <p className={cx("note")}>
            Don’t worry, happens to all of us. Enter your email below to recover
            your password
          </p>
        </div>
        <div className={cx("enterInfo")}>
          <img src={icon_username} alt="Username" className={cx("iconStart")} />
          <input
          className={cx('input')}
            placeholder="lv.hoang610@gmail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <img src={cricle} alt="Cricle" className={cx("iconEnd")} />
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

export default ForgetPassword;

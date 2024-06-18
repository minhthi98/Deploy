import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import background from "../../../../assets/images/backgroundOTP.png";
import classNames from "classnames/bind";
import styles from "./OTP.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import Button from "../../../buttons";
import AxiosInstance from "../../../../utils/AxiosInstance";

const cx = classNames.bind(styles);

function OTP() {
  const location = useLocation();
  const { username } = location.state || {};

  let navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      // Chỉ cho phép nhập số
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Tự động chuyển sang ô tiếp theo
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input${index + 1}`).focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input${index - 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const otpString = otp.join("").toString();
      const response = await AxiosInstance.post("admin/checkOTP", {
        email: username,
        otp: otpString,
      });
      if (response.data.result === true) {
        navigate("/resetPassword", { state: { username } });
      } else {
        alert("Entered Wrong OTP");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cx("container")}>
      <div className={cx("leftBackground")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" width={95} height={98} />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <div>
          <p className={cx("title")}>Please send the verification code</p>
        </div>
        <div>
          <p className={cx("note")}>
            An authentication code has been sent to your email.
          </p>
        </div>
        <div className={cx("inputCotainer")}>
          {otp.map((otp, index) => (
            <input
              key={index}
              id={`otp-input${index}`}
              className={cx("input-otp")}
              type="text"
              value={otp}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              autoFocus={index === 0}
            />
          ))}
        </div>
        <div className={cx("btnSummit")}>
          <Button login forget_btn onClick={handleSubmit}>
            VERIFY
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

export default OTP;

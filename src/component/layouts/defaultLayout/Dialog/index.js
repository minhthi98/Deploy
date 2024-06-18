import React from "react";
import styles from "./Dialog.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Dialog = ({ title, message, onClose }) => {
  return (
    <div className={cx("dialog-overlay")}>
      <div className={cx("dialog")}>
        <h2 className={cx("dialog-title")}>{title}</h2>
        <p className={cx("dialog-message")}>{message}</p>
        <button className={cx("dialog-button")} onClick={onClose}>
          close
        </button>
      </div>
    </div>
  );
};

export default Dialog;

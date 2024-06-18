import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";

const cx = classNames.bind(styles);

const AccountItemMerchant = ({ merchant, handleView }) => {
  return (
    <div className={cx("wrapper")} onClick={() => handleView(merchant._id)}>
      <img
        src={merchant.imageBackground || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name")}>
          <span>{merchant.name}</span>
        </h4>
        <span className={cx("user-name")}>{merchant.address}</span>
      </div>
    </div>
  );
};

export default AccountItemMerchant;

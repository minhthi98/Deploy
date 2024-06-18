import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";

const cx = classNames.bind(styles);

const AccountItemCustomer = ({ customer, handleView }) => {
  return (
    <div className={cx("wrapper")} onClick={() => handleView(customer._id)}>
      <img
        src={customer.avatar || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name")}>
          <span>{customer.fullName}</span>
        </h4>
        <span className={cx("user-name")}>{customer.phoneNumber}</span>
      </div>
    </div>
  );
};

export default AccountItemCustomer;

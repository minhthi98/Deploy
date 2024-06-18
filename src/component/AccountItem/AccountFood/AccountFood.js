import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";

const cx = classNames.bind(styles);

const AccountItemFood = ({ food, handleView }) => {
  return (
    <div className={cx("wrapper")} onClick={() => handleView(food._id)}>
      <img
        src={food.image || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <div className={cx("name-info")}>
          <h4 className={cx("name-food")}>
            <span>{food.nameFood}</span>
          </h4>
          <div className={cx("line")} />
          <h4 className={cx("name-merchant")}>
            <span>{food.nameMerchant}</span>
          </h4>
        </div>
        <span className={cx("user-name")}>{food.price}</span>
      </div>
    </div>
  );
};

export default AccountItemFood;

import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import {
  faChartBar,
  faGift,
  faStore,
  faTruck,
  faUser,
  faShoppingCart,
  faSignOutAlt,
  faUtensils,
  faTrash,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../contexts/UserContext";
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function Sidebar() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);
  const { t } = useTranslation();

  const [openMenus, setOpenMenus] = useState({
    reportsStatistics: true,
    voucherManager: false,
    merchantManager: false,
    shipperManager: false,
    userManager: false,
    orderManager: false,
    myAccount: false,
  });

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  

  return (
    <div className={cx("sidebar")}>
      <nav className={cx("nav")}>
        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('reportsStatistics')}>
            {t('sidebar.reportsStatistics')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.reportsStatistics })}>
            <NavLink to="/home" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faChartBar} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.dashboards')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('voucherManager')}>
            {t('sidebar.voucherManager')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.voucherManager })}>
            <NavLink to="/add-voucher" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faGift} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.addVoucher')}</span>
            </NavLink>
            <NavLink to="/all-vouchers" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faGift} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.allVouchers')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('merchantManager')}>
            {t('sidebar.merchantManager')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.merchantManager })}>
            <NavLink to="/new-merchant" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.newMerchant')}</span>
            </NavLink>
            <NavLink to="/all-merchants" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faStore} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.allMerchants')}</span>
            </NavLink>
            <NavLink to="/food-request" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faUtensils} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.foodRequests')}</span>
            </NavLink>
            <NavLink to="/deleted-merchants" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faTrash} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.deletedMerchants')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('shipperManager')}>
            {t('sidebar.shipperManager')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.shipperManager })}>
            <NavLink to="/new-shipper" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.newShipper')}</span>
            </NavLink>
            <NavLink to="/all-shippers" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faTruck} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.allShippers')}</span>
            </NavLink>
            <NavLink to="/deleted-shippers" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faTrash} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.deletedShippers')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('userManager')}>
            {t('sidebar.userManager')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.userManager })}>
            <NavLink to="/all-customers" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faUser} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.customer')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('orderManager')}>
            {t('sidebar.orderManager')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.orderManager })}>
            <NavLink to="/order" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faShoppingCart} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.order')}</span>
            </NavLink>
          </div>
        </div>

        <div className={cx("menu-item")}>
          <p className={cx("title")} onClick={() => toggleMenu('myAccount')}>
            {t('sidebar.myAccount')}
          </p>
          <div className={cx("sub-menu", { open: openMenus.myAccount })}>
            <NavLink to="/infomation" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faUser} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.infomation')}</span>
            </NavLink>
            <NavLink to="/change-password" className={({ isActive }) => cx("sub-link", { active: isActive })}>
              <FontAwesomeIcon icon={faUser} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.changePassword')}</span>
            </NavLink>
            <button className={cx("nav-link", "logout-button")} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className={cx("icon")} />
              <span className={cx("text")}>{t('sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;

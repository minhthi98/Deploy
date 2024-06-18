import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";
import debounce from "lodash/debounce";

const cx = classNames.bind(styles);

function Employee() {
  const navigate = useNavigate();
  const [Admins, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const fetchAdmins = async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (searchQuery) {
        response = await AxiosInstance.get(
          `admin/search?search=${searchQuery}`
        );
      } else {
        response = await AxiosInstance.get("admin/showAll");
      }
      setAdmin(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng debounce cho hàm fetchAdmins
  const debouncedFetchAdmins = useCallback(debounce(fetchAdmins, 500), []);

  useEffect(() => {
    debouncedFetchAdmins(search);
    // Hủy bỏ debounce khi component bị unmount
    return () => {
      debouncedFetchAdmins.cancel();
    };
  }, [search, debouncedFetchAdmins]);

  useEffect(() => {
    // Focus input chỉ khi component mount lần đầu
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Only run once after the initial render

  if (loading)
    return (
      <div className={cx("container")}>
        <div className={cx("title")}>Listing Admin Active</div>
        <p className={cx("loading")}>Loading...</p>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  const handleClick = (admin) => {
    navigate(`/employee/${admin._id}`, { state: { employee: admin } });
  };

  const handleAddAdminClick = () => {
    navigate("/add-admin");
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Listing Admin Active</div>
      <div className={cx("search-bar")}>
        <button
          onClick={handleAddAdminClick}
          className={cx("add-admin-button")}
        >
          Add New Admin
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by ID, userName, fullName, phoneNumber"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={cx("card-container")}>
        {Admins.map((admin) => (
          <div
            key={admin._id}
            className={cx("card")}
            onClick={() => handleClick(admin)}
          >
            <div className={cx("card-header")}>
              <img
                src={
                  admin.avatar ||
                  "https://th.bing.com/th/id/OIP.bbvSNRBEMEPuujn-OZ-aVgHaHa?rs=1&pid=ImgDetMain"
                }
                alt={admin.fullName}
                className={cx("avatar")}
              />
              <div className={cx("info")}>
                <div className={cx("name")}>{admin.fullName}</div>
                <div className={cx("email")}>Email: {admin.email}</div>
                <div className={cx("phone")}>
                  PhoneNumber: {admin.phoneNumber}
                </div>
                <div className={cx("position")}>Position: {admin.position}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Employee;

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";

import AxiosInstance from "../../../../utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./AllCustomer.module.scss";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AccountItem from "../../../AccountItem/AccountCustomer/AccountCustomer";
const cx = classNames.bind(styles);

function AllCustomer() {
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };
  
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState({});
  const [detailAddress, setDetailAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [data, setData] = useState([]);

  //lấy danh sách customer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("customers/getAllCustomer");
        const customers = response.data.customer;
        setData(customers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  
  // gọi api lấy orderStatus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrderStatus");
        console.log(response);
        setOrderStatuses(response.data.orderStatus);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id) => {
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`customers/?id=${id}`);
      const detailCustomer = response.data;
      if (detailCustomer.result === true) {
        setDetailCustomer({
          ...detailCustomer.customer,
          joinDay: formatDate(detailCustomer.customer.joinDay),
        });
        setDetailAddress(detailCustomer.address || []);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // show history customer
  const handleHistory = async (id) => {
    try {
      const response = await AxiosInstance.get(
        `customers/getHistoryCustomer/?id=${id}`
      );
      console.log(response);
      if (
        Array.isArray(response.data.history) &&
        response.data.history.length === 0
      ) {
        // Nếu history là một mảng rỗng, tức là không có đơn hàng
        Swal.fire({
          icon: "info",
          title: "No orders placed",
          text: "No orders have been placed!",
        });
      } else {
        if (Array.isArray(response.data.history)) {
          const updatedHistory = response.data.history.map((item) => ({
            ...item,
            timeBook: formatDate(item.timeBook),
            nameStatus: getOrderStatusName(item.status),
          }));
          setDataHistory(updatedHistory);
          setShowModalHistory(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      customClass: {
        popup: cx("swal2-popup"),
        title: cx("swal2-title"),
        confirmButton: cx("swal2-confirm"),
        cancelButton: cx("swal2-cancel"),
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await AxiosInstance.get(
            `customers/deleteCustomer/?id=${id}`
          );
          console.log(response);
          setData(data.filter((customer) => customer._id !== id));
          Swal.fire("Deleted!", "Your merchant has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete customer:", error);
          Swal.fire("Error!", "Failed to delete customer.", "error");
        }
      }
    });
  };

  //đóng mở modal
  const handleModalClose = () => {
    setShowModal(false);
    setShowModalHistory(false);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/customers/findCustomer", {
          keyword,
        });
        if (response.data.result && response.data.customers.length > 0) {
          setSearchResult(response.data.customers);
          setTippyVisible(true);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  function getOrderStatusName(statusId) {
    console.log(orderStatuses);
    const matchingStatus = orderStatuses.find(
      (status) => status._id === statusId
    );
    return matchingStatus ? matchingStatus.name : "N/A";
  }

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Customers</p>
        <div>
          <Tippy
            animation="fade"
            interactive
            placement="bottom"
            onClickOutside={handleClickOutSide}
            visible={tippyVisible}
            render={(attrs) => (
              <div tabIndex="-1" {...attrs} className={cx("search-result")}>
                {searchResult.length > 0 && (
                  <ProperWrapper>
                    <h4 className={cx("search-title")}>Accounts</h4>
                    {searchResult.length > 0
                      ? searchResult.map((customer) => (
                          <AccountItem
                            key={customer._id}
                            customer={customer}
                            handleView={handleView}
                          />
                        ))
                      : setTippyVisible(false)}
                  </ProperWrapper>
                )}
              </div>
            )}
          >
            <div className={cx("inputSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx("icon-search")}
              />
              <input
                className={cx("input")}
                placeholder="Search by name"
                onChange={handleSearch}
              />
            </div>
          </Tippy>
        </div>
        <div className={cx("line-background")} />
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Birth Day</th>
                <th>Avatar</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row")}
                  onClick={() => handleView(item._id)}
                >
                  <td>{index + 1}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.birthDay}</td>
                  <td>
                    <img
                      src={item.avatar}
                      alt={`${item.name} logo`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistory(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faClockRotateLeft} />
                    </button>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Modal show customer*/}
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Customer"
          className={cx("modal-wrapper")}
        >
          {detailCustomer && (
            <div className={cx("modal-container")}>
              <div className={cx("logo-merchant")}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={image_merchant}
                  alt="Merchant"
                  className={cx("img-merchant")}
                />
              </div>
              <div className={cx("content")}>
                <Button reviewed>Reviewed</Button>
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant")}>
                    {detailCustomer.fullName}
                  </p>
                  <div className={cx("line")}></div>
                  <p className={cx("type-merchant")}>{detailCustomer.sex}</p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Address:</p>
                  {detailAddress.map((address, index) => (
                    <p key={index} className={cx("content-merchant")}>
                      {[
                        address.houseNumber,
                        address.street,
                        address.ward,
                        address.district,
                        address.city,
                      ].join(", ") || "N/A"}
                    </p>
                  ))}
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Email:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.email}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Birth Day:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.birthDay}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Phone Number:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.phoneNumber}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Join Day:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.joinDay}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Rating:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.rating}
                  </p>
                </div>
                <div className={cx("btn-delete")}>
                  <Button
                    approve_btn
                    onClick={() => {
                      handleHistory(detailCustomer._id);
                    }}
                  >
                    History
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/*Modal show history customer */}
        <Modal
          isOpen={showModalHistory}
          onRequestClose={handleModalClose}
          contentLabel="HistoryCustomer"
          className={cx("modal-history")}
        >
          <div className={cx("box-history")}>
            <h2 className={cx("title-history")}>History Customer</h2>
            <table className={cx("table")}>
              <thead className={cx("table-row-history")}>
                <tr>
                  <th>#</th>
                  <th>Name Merchant</th>
                  <th>Name Shipper </th>
                  <th>Delivery Address</th>
                  <th>Time Book</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className={cx("table-row-history")}>
                {dataHistory.map((item, index) => (
                  <tr key={index} onClick={() => handleView(item._id)}>
                    <td>{index + 1}</td>
                    <td>{item.merchantID ? item.merchantID.name : "N/A"}</td>
                    <td>{item.shipperID ? item.shipperID.fullName : "N/A"}</td>
                    <td>{item ? item.deliveryAddress : "N/A"}</td>
                    <td>{item ? item.timeBook : "N/A"}</td>
                    <td>{item ? item.totalPaid + " đ" : "N/A"}</td>
                    <td>
                      <p
                        className={cx(
                          "status", // Base class for all status elements
                          item.nameStatus === "cancel"
                            ? "status-cancel"
                            : "status-work"
                        )}
                      >
                        {item.nameStatus}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
              <div className={cx('line')}/>
            </table>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AllCustomer;

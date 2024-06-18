import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AxiosInstance from "../../../../utils/AxiosInstance";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./AllMerchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import { Wrapper as ProperWrapper } from "../../../Proper/index";

const cx = classNames.bind(styles);

function AllMerchant() {
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };

  const [data, setData] = useState([{}]);
  const [selectMerchantById, setSelectMerchantId] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);

  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [orderStatuses, setOrderStatuses] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [documents, setDocuments] = useState([]);
  const [idCardDocuments, setIdCardDocuments] = useState([]);
  const [licenseDriverDocuments, setLicenseDriverDocuments] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);

  //gọi api allMerchant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("merchants/getAllMerchant");
        const merchants = response.data.merchants;
        setData(merchants);

        const responseType = await AxiosInstance.get(
          "merchants/getAllTypeOfMerchant"
        );
        setTypes(responseType.data.types);
      } catch (error) {
        setTypes([]);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //load data lên màn hình
  useEffect(() => {
    if (selectMerchantById) {
      console.log(selectMerchantById);
      setId(selectMerchantById._id || "");
      setName(selectMerchantById.name || "");
      setAddress(selectMerchantById.address || "");
      setCloseTime(selectMerchantById.closeTime || "");
      setOpenTime(selectMerchantById.openTime || "");
      setPhoneNumber(
        selectMerchantById.user ? selectMerchantById.user.phoneNumber : ""
      );
      setFullName(
        selectMerchantById.user ? selectMerchantById.user.fullName : ""
      );
      const filteredDocuments = selectMerchantById.document || [];
      setIdCardDocuments(
        filteredDocuments.filter((doc) => doc.documentTypeID.name === "ID Card")
      );
      setLicenseDriverDocuments(
        filteredDocuments.filter(
          (doc) => doc.documentTypeID.name === "Business License"
        )
      );
      setDocuments(filteredDocuments);
      setTypeId(selectMerchantById.type ? selectMerchantById.type._id : "");
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "N/A");
      setType(selectMerchantById.type ? selectMerchantById.type.name : "N/A");
    }
  }, [selectMerchantById]);

  // gọi api lấy orderStatus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrderStatus");
        setOrderStatuses(response.data.orderStatus);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await AxiosInstance.get(`merchants/?id=${id}`);
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setIsEditModal(true);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
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
          const response = await AxiosInstance.post(
            `merchants/deleteMerchant/?id=${id}`
          );
          console.log(response);
          setData(data.filter((merchant) => merchant._id !== id));
          Swal.fire("Deleted!", "Your merchant has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete merchant:", error);
          Swal.fire("Error!", "Failed to delete merchant.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
    setShowModalHistory(false);
  };

  const handleView = async (id) => {
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(
        `merchants/getMerchantById/?id=${id}`
      );
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
        setIsEditModal(false);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        name,
        address,
        closeTime,
        openTime,
        phoneNumber,
        fullName,
        email,
        type: typeId,
      };

      const response = await AxiosInstance.patch(
        `merchants/updateMerchant?id=${selectMerchantById._id}`,
        updateData
      );

      const updatedMerchant = response.data.merchantNew;
      setData((prevData) =>
        prevData.map((merchant) =>
          merchant._id === updatedMerchant._id ? updatedMerchant : merchant
        )
      );
      setShowModal(false);
      setIsEditModal(false);
      Swal.fire("Success", "Merchant updated successfully.", "success");
    } catch (error) {
      console.error("Failed to update merchant:", error);
      Swal.fire("Error", "Failed to update merchant.", "error");
    }
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/merchants/findMerchant", {
          keyword,
        });
        console.log(response);
        if (response.data.result && response.data.merchants.length > 0) {
          setSearchResult(response.data.merchants);
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

  // show history customer
  const handleHistory = async (id) => {
    try {
      const response = await AxiosInstance.get(
        `merchants/getHistoryMerchant/?id=${id}`
      );
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
          console.log(updatedHistory);
          setDataHistory(updatedHistory);
          setShowModalHistory(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  function getOrderStatusName(statusId) {
    const matchingStatus = orderStatuses.find(
      (status) => status._id === statusId
    );
    return matchingStatus ? matchingStatus.name : "N/A";
  }

  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Merchant</p>
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
                      ? searchResult.map((merchant) => (
                          <AccountItemMerchant
                            key={merchant._id}
                            merchant={merchant}
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
                <th>Address</th>
                <th>Time</th>
                <th>Image</th>
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
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.openTime}</td>
                  <td>
                    <img
                      src={logo}
                      alt={`${item.name} logo`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
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
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Update Merchant"
          className={cx("modal")}
        >
          {selectMerchantById && (
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
                {!isEditModal ? <Button reviewed>Reviewed</Button> : ""}
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("name-merchant")}
                        name="name"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      name
                    )}
                  </p>
                  <div className={cx("line")}></div>
                  <p className={cx("type-merchant")}>
                    {isEditModal ? (
                      <select
                        className={cx("type-merchant")}
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                      >
                        {types.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      type || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Address:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="address"
                        defaultValue={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      address || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Email:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      email || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Store Owner:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="fullName"
                        defaultValue={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    ) : (
                      fullName || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>PhoneNumber:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="phoneNumber"
                        defaultValue={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    ) : (
                      phoneNumber || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Open Time:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="openTime"
                        defaultValue={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                      />
                    ) : (
                      openTime || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Close Time:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="closeTime"
                        defaultValue={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                      />
                    ) : (
                      closeTime || "N/A"
                    )}
                  </p>
                </div>
                <div>
                  {idCardDocuments.map((doc, index) => (
                    <div key={index} className={cx("wrapper-image-content")}>
                      <div className={cx("wrapper-title-document")}>
                        <p className={cx("title-merchant")}>
                          {doc.documentTypeID.name}
                        </p>
                      
                      </div>
                      <div className={cx("wrapper-document")}>
                        <img
                          src={doc.imageFontSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                        <img
                          src={doc.imageBackSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        /> 
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {licenseDriverDocuments.map((doc, index) => (
                    <div key={index} className={cx("wrapper-image-content")}>
                      <div className={cx("wrapper-title-document")}>
                        <p className={cx("title-merchant")}>
                          {doc.documentTypeID.name}
                        </p>
                      </div>
                      <div className={cx("wrapper-document")}>
                        <img
                          src={doc.imageFontSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                        <img
                          src={doc.imageBackSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={cx("btn-delete")}>
                  {isEditModal ? (
                    <Button approve_btn onClick={handleUpdate}>
                      Update
                    </Button>
                  ) : (
                    <Button approve_btn onClick={() => handleHistory(id)}>
                      History
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/*Modal show history merchants */}
        <Modal
          isOpen={showModalHistory}
          onRequestClose={handleModalClose}
          contentLabel="HistoryMerchant"
          className={cx("modal-history")}
        >
          <div className={cx("box-history")}>
            <h2 className={cx("title-history")}>History Merchant</h2>
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
                    <td>{item ? item.priceFood + " đ" : "N/A"}</td>

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
            </table>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AllMerchant;

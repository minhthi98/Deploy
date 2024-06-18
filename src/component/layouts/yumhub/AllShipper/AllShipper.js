import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./AllShipper.module.scss";
import Modal from "react-modal";
import logo from "../../../../assets/images/logoYumhub.png";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AllShipper() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await AxiosInstance.get("shippers/getAllShipper");
        console.log(response);
        // Kiểm tra và xử lý dữ liệu từ API
        if (response.data.AllShipper
          && Array.isArray(response.data.AllShipper
          )) {
          setShippers(response.data.AllShipper
          );
        } else {
          setError("Invalid data format from API");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);

  const handleEditClick = (e, shipper) => {
    e.stopPropagation();
    console.log("Edit shipper:", shipper);
  };

  const handleDeleteClick = (e, shipper) => {
    e.stopPropagation();
    console.log("Delete shipper:", shipper);
  };

  const handleViewClick = (e, shipper) => {
    e.stopPropagation();

    setSelectedShipper(shipper);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>All Shipper</div>
      <div className={cx("table-container")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Information</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Bike</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(shippers) &&
              shippers.map((shipper) => (
                <tr
                  key={shipper._id}
                  onClick={(e) => handleViewClick(e, shipper)}
                >
                  <td>{shipper._id}</td>

                  <td>
                    <div className={cx("info")}>
                      <img
                        src={shipper.avatar}
                        alt={shipper.fullName}
                        className={cx("avatar")}
                      />
                      <div className={cx("sub-info")}>
                        <div className={cx("name")}>{shipper.fullName}</div>
                        <div className={cx("gender-dob")}>
                          <div className={cx("gender")}>{shipper.sex}</div>
                          <div className={cx("dob")}>{shipper.birthDay}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{shipper.phoneNumber}</td>
                  <td>{shipper.address}</td>
                  <td>{shipper.idBike}</td>
                  <td>
                    <span
                      className={cx("status", {
                        active: shipper.status === "Active",
                      })}
                    >
                      {shipper.status}
                    </span>
                  </td>
                  <td className={cx("actions")}>
                    <FaEye
                      className={cx("action-icon")}
                      title="View"
                      onClick={(e) => handleViewClick(e, shipper)}
                    />
                    <FaEdit
                      className={cx("action-icon")}
                      title="Edit"
                      onClick={(e) => handleEditClick(e, shipper)}
                    />
                    <FaTrashAlt
                      className={cx("action-icon")}
                      title="Delete"
                      onClick={(e) => handleDeleteClick(e, shipper)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Shipper Details"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedShipper && (
          <div className={cx("modal-content")}>
            <div className={cx("info-main")}>
              <div className={cx("modal-header")}>
                <div className={cx("modal-avatar-container")}>
                  <img
                    src={selectedShipper.avatar || "/default-avatar.png"}
                    alt={selectedShipper.fullName}
                    className={cx("modal-avatar")}
                  />
                </div>
                <div className={cx("modal-info")}>
                  <p className={cx("modal-balance")}>
                    <strong>Balance:</strong> {selectedShipper.balance} VND
                  </p>
                  <p className={cx("modal-rating")}>
                    <strong>Rating:</strong> {selectedShipper.rating} ★
                  </p>
                </div>
              </div>
              <div className={cx("modal-body")}>
                <div className={cx("modal-section")}>
                  <label>FullName</label>
                  <input
                    type="text"
                    value={selectedShipper.fullName}
                    readOnly
                  />
                </div>
                <div className={cx("modal-section")}>
                  <label>Email</label>
                  <input type="text" value={selectedShipper.email} readOnly />
                </div>
                <div className={cx("modal-section")}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={selectedShipper.phoneNumber}
                    readOnly
                  />
                </div>
                <div className={cx("modal-section")}>
                  <label>Day of Birth</label>
                  <input
                    type="text"
                    value={selectedShipper.dayOfBirth}
                    readOnly
                  />
                </div>
                <div className={cx("modal-section")}>
                  <label>Join Date</label>
                  <input
                    type="text"
                    value={selectedShipper.joinDate}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className={cx("modal-documents")}>
              <h3>Document</h3>
              <div className={cx("document-container")}>
                <div className={cx("document-item")}>
                  <h4>National identity card</h4>
                  <img
                    src={selectedShipper.idCard.front||logo}
                    alt="Front ID"
                  />
                  <img
                    src={selectedShipper.idCard.back||logo}
                    alt="Back ID"
                  />
                </div>
                <div className={cx("document-item")}>
                  <h4>Vehicle registration papers</h4>
                  <img
                    src={selectedShipper.vehicleCertificate.front||logo}
                    alt="Front Vehicle"
                  />
                  <img
                    src={selectedShipper.vehicleCertificate.back||logo}
                    alt="Back Vehicle"
                  />
                </div>
                <div className={cx("document-item")}>
                  <h4>Driver's license</h4>
                  <img
                    src={selectedShipper.driverLicense.front||logo}
                    alt="Front License"
                  />
                  <img
                    src={selectedShipper.driverLicense.back||logo}
                    alt="Back License"
                  />
                </div>
              </div>
            </div>
            <div className={cx("modal-actions")}>
              <button className={cx("cancel-btn")} onClick={closeModal}>
                Cancel
              </button>
              <button className={cx("update-btn")}>Update</button>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
}

export default AllShipper;

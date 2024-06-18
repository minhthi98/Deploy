import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./AddShipper.module.scss";
import Modal from "react-modal";
import logo from "../../../../assets/images/logoYumhub.png";
const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AddShipper() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await AxiosInstance.get(
          "shippers/listShipperApproval"
        );
        setShippers(response.data.listShipper);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);

  const handleCardClick = (shipper) => {
    setSelectedShipper(shipper);
    setIsModalOpen(true);
  };
  const checkDocuments=(front, back)=>{
    if(front && back){
      return "available"
    }else return "not available"
  }
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Shipper Awaiting Approval</div>
      <div className={cx("search-bar")}>
        <input type="text" placeholder="Nombre, Unidad, Status" />
      </div>
      <div className={cx("card-container")}>
        {shippers.map((shipper) => (
          <div
            key={shipper._id}
            className={cx("card")}
            onClick={() => handleCardClick(shipper)}
          >
            <div className={cx("card-header")}>
              <div className={cx("avatar-container")}>
                <img
                  src={shipper.avatar || "/default-avatar.png"}
                  alt={shipper.fullName}
                  className={cx("avatar")}
                />
              </div>
              <div className={cx("info")}>
                <div className={cx("name")}>{shipper.fullName}</div>
                <div className={cx("phone")}>{shipper.phoneNumber}</div>
              </div>
            </div>
            <div className={cx("card-body")}>
              <div className={cx("detail")}>
                <strong>ID Card:</strong> {checkDocuments(shipper.idCard.front, shipper.idCard.back)}
              </div>
              <div className={cx("detail")}>
                <strong>Driver License:</strong> {checkDocuments(shipper.driverLicense.front, shipper.driverLicense.back)}
              </div>
              <div className={cx("detail")}>
                <strong>Vehicle Certificate:</strong> {checkDocuments(shipper.vehicleCertificate.front, shipper.vehicleCertificate.back)}
              </div>
            </div>
          </div>
        ))}
      </div>
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
              <button className={cx("approve-btn")}>Approve</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddShipper;

import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FaEdit } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./AllVoucher.module.scss";
import { format } from "date-fns";
import Modal from "react-modal";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AllVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editConditionApply, setEditConditionApply] = useState("");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await AxiosInstance.get("vouchers/allVoucher");
        setVouchers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleEditClick = (e, voucher) => {
    e.stopPropagation();
    setSelectedVoucher(voucher);
    setEditStartDate(format(new Date(voucher.startDate), "yyyy-MM-dd"));
    setEditEndDate(format(new Date(voucher.endDate), "yyyy-MM-dd"));
    setEditConditionApply(voucher.conditionsApply);
    setIsEditModalOpen(true);
  };

  const handleRowClick = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const start = new Date(startDate);
    if (now <= start || now >= end) {
      return "Not-valid";
    } else return "Valid";
  };

  const handleUpdateVoucher = async () => {
    try {
      await AxiosInstance.patch(`vouchers/updateVoucher?id=${selectedVoucher._id}`, {
        startDate: editStartDate,
        endDate: editEndDate,
        conditionsApply: editConditionApply,
      });
      const updatedVouchers = vouchers.map((voucher) =>
        voucher._id === selectedVoucher._id
          ? {
              ...voucher,
              startDate: new Date(editStartDate),
              endDate: new Date(editEndDate),
              conditionsApply: editConditionApply,
            }
          : voucher
      );
      setVouchers(updatedVouchers);
      closeEditModal();
    } catch (err) {
      console.error("Failed to update voucher", err);
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    if (statusFilter === "") return true;
    return getStatus(voucher.startDate, voucher.endDate) === statusFilter;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("title")}>All Voucher</div>
        <div className={cx("filter-container")}>
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Valid">Valid</option>
            <option value="Not-valid">Not-valid</option>
          </select>
        </div>
      </div>

      <div className={cx("table-container")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers.map((voucher) => (
              <tr key={voucher._id} onClick={() => handleRowClick(voucher)}>
                <td>{voucher._id}</td>
                <td>{voucher.nameVoucher}</td>
                <td>{voucher.code}</td>
                <td>{format(new Date(voucher.startDate), "dd/MM/yyyy")}</td>
                <td>{format(new Date(voucher.endDate), "dd/MM/yyyy")}</td>
                <td>
                  <span
                    className={cx("status", {
                      Valid:
                        getStatus(voucher.startDate, voucher.endDate) ===
                        "Valid",
                      "Not-valid":
                        getStatus(voucher.startDate, voucher.endDate) ===
                        "Not-valid",
                    })}
                  >
                    {getStatus(voucher.startDate, voucher.endDate)}
                  </span>
                </td>
                <td className={cx("actions")}>
                  <FaEdit
                    className={cx("action-icon")}
                    title="Edit Voucher"
                    onClick={(e) => handleEditClick(e, voucher)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Voucher Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={cx("modal", "voucher-details-modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedVoucher && (
          <div>
            <h2>Voucher Details</h2>
            <table className={cx("details-table")}>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{selectedVoucher._id}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{selectedVoucher.nameVoucher}</td>
                </tr>
                <tr>
                  <td>Code</td>
                  <td>{selectedVoucher.code}</td>
                </tr>
                <tr>
                  <td>Start Date</td>
                  <td>
                    {format(new Date(selectedVoucher.startDate), "dd/MM/yyyy")}
                  </td>
                </tr>
                <tr>
                  <td>End Date</td>
                  <td>
                    {format(new Date(selectedVoucher.endDate), "dd/MM/yyyy")}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{getStatus(selectedVoucher.startDate, selectedVoucher.endDate)}</td>
                </tr>
                <tr>
                  <td>Conditions Apply</td>
                  <td>{selectedVoucher.conditionsApply}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={closeModal} className={cx("button")}>Close</button>
          </div>
        )}
      </Modal>

      {/* Edit Voucher Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className={cx("modal", "edit-modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedVoucher && (
          <div>
            <h2 className={cx("modal-title")}>Edit Voucher</h2>
            <div className={cx("modal-date")}>
              <label>
                Start Date:
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className={cx("input-date")}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className={cx("input-date")}
                />
              </label>
            </div>
            <label>
              Conditions Apply:
              <select
                value={editConditionApply}
                onChange={(e) => setEditConditionApply(e.target.value)}
              >
                <option value="50000">Đơn hàng trên 50.000 vnđ</option>
                <option value="100000">Đơn hàng trên 100.000 vnđ</option>
                <option value="150000">Đơn hàng trên 150.000 vnđ</option>
              </select>
            </label>
            <div className={cx("button-container")}>
              <button onClick={handleUpdateVoucher} className={cx("button")}>
                Save
              </button>
              <button onClick={closeEditModal} className={cx("button")}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AllVoucher;

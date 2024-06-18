import React, { useState, useEffect, useRef, useCallback } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import Modal from "react-modal";
import debounce from "lodash/debounce";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import ReactSlider from "react-slider";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = useState(false);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAmount, setFilterAmount] = useState([0, 10000000]);

  const searchInputRef = useRef(null);


  const fetchOrders = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = query.trim()
        ? await AxiosInstance.get(`orders/searchOrder?key=${query}`)
        : await AxiosInstance.get("orders/getAllOrder");

      const fetchedOrders = response.data.order || response.data.orders;
      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
      } else {
        setError("Invalid data format from API");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, []);

  const debouncedFetchOrders = useCallback(debounce(fetchOrders, 1000), [
    fetchOrders,
  ]);

  useEffect(() => {
    debouncedFetchOrders(searchQuery);
    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [searchQuery, debouncedFetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewClick = (e, order) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCustomerClick = (e, customerID) => {
    e.stopPropagation();
    const customer = orders.find(
      (order) => order.customerID._id === customerID
    )?.customerID;
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleShipperClick = (e, shipperID) => {
    e.stopPropagation();
    const shipper = orders.find(
      (order) => order.shipperID._id === shipperID
    )?.shipperID;
    setSelectedShipper(shipper);
    setIsShipperModalOpen(true);
  };

  const handleMerchantClick = (e, merchantID) => {
    e.stopPropagation();
    const merchant = orders.find(
      (order) => order.merchantID._id === merchantID
    )?.merchantID;
    setSelectedMerchant(merchant);
    setIsMerchantModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    setIsCustomerModalOpen(false);
    setIsShipperModalOpen(false);
    setIsMerchantModalOpen(false);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", { minimumFractionDigits: 0 });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];
    const orderMultiplier = sortOrder === "asc" ? 1 : -1;

    if (valueA < valueB) return -1 * orderMultiplier;
    if (valueA > valueB) return 1 * orderMultiplier;
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    return (
      (!filterStatus || order.status.name === filterStatus) &&
      order.totalPaid >= filterAmount[0] &&
      order.totalPaid <= filterAmount[1]
    );
  });

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterAmountChange = (values) => {
    setFilterAmount(values);
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("title")}>All Orders</div>
        <div className={cx("search-container")}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search orders..."
            className={cx("search-input")}
            ref={searchInputRef}
          />
        </div>
      </div>

      <div className={cx("filters")}>
        <select
          value={filterStatus}
          onChange={handleFilterStatusChange}
          className={cx("filter-select")}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancel">Cancel</option>
          <option value="backordered">Back Ordered</option>
          <option value="fakeOrder">Fake Order</option>
        </select>
        <div className={cx("filter-slider-container")}>
          <div className={cx("filter-slider-label")}>Total Paid</div>
          <ReactSlider
            className={cx("filter-slider")}
            thumbClassName={cx("filter-slider-thumb")}
            trackClassName={cx("filter-slider-track")}
            value={filterAmount}
            onChange={handleFilterAmountChange}
            min={0}
            max={10000000}
            step={100}
          />
          <div className={cx("filter-slider-values")}>
            <span>{formatCurrency(filterAmount[0])}</span>
            <span>{formatCurrency(filterAmount[1])}</span>
          </div>
        </div>
      </div>

      <div className={cx("table-container")}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table className={cx("table")}>
            <thead>
              <tr>
                <th onClick={() => handleSort("_id")}>
                  Order Number {getSortIcon("_id")}
                </th>
                <th>Customer</th>
                <th>Shipper</th>
                <th>Merchant</th>
                <th onClick={() => handleSort("timeBook")}>
                  Time Book {getSortIcon("timeBook")}
                </th>
                <th onClick={() => handleSort("timeGiveFood")}>
                  Delivery Date {getSortIcon("timeGiveFood")}
                </th>
                <th>Status</th>
                <th onClick={() => handleSort("totalPaid")}>
                  Total Amount {getSortIcon("totalPaid")}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredOrders) &&
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={(e) => handleViewClick(e, order)}
                  >
                    <td className={cx("order-number")}>{order._id}</td>
                    <td
                      onClick={(e) =>
                        handleCustomerClick(e, order.customerID._id)
                      }
                    >
                      {order.customerID?.fullName || "Unknown"}
                    </td>
                    <td
                      onClick={(e) =>
                        handleShipperClick(e, order.shipperID._id)
                      }
                    >
                      {order.shipperID?.fullName || "Unknown"}
                    </td>
                    <td
                      onClick={(e) =>
                        handleMerchantClick(e, order.merchantID._id)
                      }
                    >
                      {order.merchantID?.name || "Unknown"}
                    </td>
                    <td>{new Date(order.timeBook).toLocaleString()}</td>
                    <td>{new Date(order.timeGiveFood).toLocaleString()}</td>
                    <td>{order.status?.name || "Unknown"}</td>
                    <td>{formatCurrency(order.totalPaid)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isOrderModalOpen}
        onRequestClose={closeModal}
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedOrder && (
          <div className={cx("modal-content")}>
            <h2>Order Details</h2>
            <p>Order Number: {selectedOrder._id}</p>
            <p>Customer: {selectedOrder.customerID?.fullName || "Unknown"}</p>
            <p>Shipper: {selectedOrder.shipperID?.fullName || "Unknown"}</p>
            <p>Merchant: {selectedOrder.merchantID?.name || "Unknown"}</p>
            <p>
              Time Book: {new Date(selectedOrder.timeBook).toLocaleString()}
            </p>
            <p>
              Delivery Date:{" "}
              {new Date(selectedOrder.timeGiveFood).toLocaleString()}
            </p>
            <p>Status: {selectedOrder.status?.name || "Unknown"}</p>
            <p>Total Amount: {formatCurrency(selectedOrder.totalPaid)}</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCustomerModalOpen}
        onRequestClose={closeModal}
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedCustomer && (
          <div className={cx("modal-content")}>
            <h2>Customer Details</h2>
            <p>Customer ID: {selectedCustomer._id}</p>
            <p>Full Name: {selectedCustomer.fullName}</p>
            <p>Email: {selectedCustomer.email}</p>
            <p>Phone: {selectedCustomer.phone}</p>
            <p>Address: {selectedCustomer.address}</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isShipperModalOpen}
        onRequestClose={closeModal}
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedShipper && (
          <div className={cx("modal-content")}>
            <h2>Shipper Details</h2>
            <p>Shipper ID: {selectedShipper._id}</p>
            <p>Full Name: {selectedShipper.fullName}</p>
            <p>Email: {selectedShipper.email}</p>
            <p>Phone: {selectedShipper.phone}</p>
            <p>Address: {selectedShipper.address}</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isMerchantModalOpen}
        onRequestClose={closeModal}
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedMerchant && (
          <div className={cx("modal-content")}>
            <h2>Merchant Details</h2>
            <table className={cx("details-table")}>
              <tbody>
                <tr>
                  <td>Merchant ID</td>
                  <td>{selectedMerchant._id}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{selectedMerchant.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{selectedMerchant.email}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{selectedMerchant.phoneNumber}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{selectedMerchant.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Orders;

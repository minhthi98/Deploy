import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./AddAdmin.module.scss";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@mui/material/Button"; // Importing Button from MUI

const cx = classNames.bind(styles);

function AddAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    avatar: "",
    email: "",
    address: "",
    gender: "",
    phoneNumber: "",
    position: "",
    dob: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setErrors({ ...errors, dob: "" });
  };

  const validate = () => {
    const newErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    else if (!phonePattern.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone Number must be 10 digits";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmAdd = async () => {
    setLoading(true);
    setApiError(null);
    setConfirmDialogOpen(false);
    try {
      await AxiosInstance.post("/admin/createAdmin", formData);
      setSnackbarMessage("Admin added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoading(false);

      setTimeout(() => {
        navigate("/employee");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        const { message } = err.response.data;
        setApiError(message);
      } else {
        setApiError(err.message);
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const isFormFilled = Object.values(formData).some((value) => value !== "");
    if (isFormFilled) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/employee");
      }
    } else {
      navigate("/employee");
    }
  };

  return (
    <div className={cx("container")}>
      <h2>Add New Admin</h2>
      {apiError && <p className={cx("error")}>{apiError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.userName}</span>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.fullName}</span>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.email}</span>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.phoneNumber}</span>

        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        >
          <option value="">Select Position</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <span className={cx("error-message")}>{errors.position}</span>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className={cx("error-message")}>{errors.gender}</span>

        <div className={cx("form-group")}>
          <label>Date of Birth</label>
          <input
            className={cx("date-input")}
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <span className={cx("error-message")}>{errors.dob}</span>
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL"
          value={formData.avatar}
          onChange={handleChange}
        />

        <div className={cx("buttons")}>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Admin"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Add Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to add this admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAdd} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default AddAdmin;

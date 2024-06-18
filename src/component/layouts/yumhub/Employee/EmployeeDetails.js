import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./EmployeeDetails.module.scss";
import { format } from "date-fns";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AxiosInstance from "../../../../utils/AxiosInstance";

const cx = classNames.bind(styles);

function EmployeeDetails() {
  const location = useLocation();
  const { state } = location;
  const { employee } = state || {};
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedPosition, setSelectedPosition] = useState(employee?.position || "Position 1");
  const [actionType, setActionType] = useState(""); // "edit" or "delete"

  if (!employee) {
    return <p>Employee details not found.</p>;
  }

  const handleConfirm = async () => {
    setConfirmDialogOpen(false);
    if (actionType === "edit") {
      handleEdit();
    } else if (actionType === "delete") {
      handleDelete();
    }
  };

  const handleEdit = async () => {
    try {
      await AxiosInstance.post(`admin/updateEmployee?id=${employee._id}`, {
        position: selectedPosition
      });
      setSnackbarMessage("Employee details updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbarMessage("Failed to update employee details.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await AxiosInstance.post(`admin/deleteAdmin?id=${employee._id}`);
      setSnackbarMessage("Employee deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);

      // Delay navigation to ensure snackbar is visible
      setTimeout(() => {
        navigate(`/employee`);
      }, 800);
    } catch (error) {
      setSnackbarMessage("Failed to delete employee.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("card")}>
        <div className={cx("profile-wrapper")}>
          <div className={cx("profile")}>
            <img
              src={
                employee.avatar ||
                "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/252397505_197007939245865_5889774168621917087_n.png?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XAM0kfbPjJQQ7kNvgFG8RAB&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYAIEyXfIv5mbu2aGMIrC6MGf9N-rMoSQ2r4LtZKb5YW7w&oe=665F6755"
              }
              alt={employee.fullName}
              className={cx("avatar")}
            />
            <p className={cx("id")}>
              <i className="fas fa-phone-alt"></i>id: {employee._id}
            </p>
            <h2 className={cx("name")}>{employee.fullName}</h2>
            <p className={cx("contact")}>
              <i className="fas fa-phone-alt"></i> {employee.phoneNumber}
            </p>
            <p className={cx("contact")}>
              <i className="fas fa-envelope"></i> {employee.email}
            </p>
          </div>
          <div className={cx("info-container")}>
            <h3>Information</h3>
            <div className={cx("info")}>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {format(new Date(employee.dob), "dd/MM/yyyy")}
              </p>
              <p>
                <strong>Gender:</strong> {employee.gender}
              </p>
              <p>
                <strong>Address:</strong> {employee.address}
              </p>
              <p>
                <strong>Position:</strong> {employee.position}
              </p>
            </div>
          </div>
        </div>

        <div className={cx("btn")}>
          <button
            className={cx("btn-edit")}
            onClick={() => {
              setActionType("edit");
              setEditDialogOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className={cx("btn-delete")}
            onClick={() => {
              setActionType("delete");
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the new position for the employee.
          </DialogContentText>
          <div className={cx("divider")}>
            <p className={cx("label")}>Current Position: </p>
            <select
              value={selectedPosition}
              onChange={handlePositionChange}
              className={cx("select")}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setConfirmDialogOpen(true);
            setEditDialogOpen(false);
          }} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setConfirmDialogOpen(true);
            setDeleteDialogOpen(false);
          }} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm {actionType === "edit" ? "Edit" : "Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType === "edit" ? "edit the employee's position" : "delete this employee"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
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

export default EmployeeDetails;
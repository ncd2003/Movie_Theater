import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";

const Users = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false); // Quản lý trạng thái popup
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "Admin",
    },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "User" },
  ]);

  // Lọc danh sách user theo tên
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý mở/đóng popup
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Xử lý thay đổi trong form create user
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Xử lý thêm user mới
  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setUsers([...users, { id: users.length + 1, ...newUser }]);
      setNewUser({ name: "", email: "", role: "" }); // Reset form
      handleClose(); // Đóng popup
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "70px" }}>
          {/* Thanh tìm kiếm và nút Create User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Search by name..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Button variant="contained" color="success" onClick={handleOpen}>
              Create User
            </Button>
          </div>

          {/* Bảng hiển thị Users */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Link to={`/view-user/${user.id}`}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          View
                        </Button>
                      </Link>
                      <Link to={`/edit-user/${user.id}`}>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          style={{ marginLeft: "5px" }}
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: "5px" }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Popup Create User */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="dense"
                value={newUser.name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="dense"
                value={newUser.email}
                onChange={handleChange}
              />
              <TextField
                label="Role"
                name="role"
                fullWidth
                margin="dense"
                value={newUser.role}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                color="primary"
                variant="contained"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Users;

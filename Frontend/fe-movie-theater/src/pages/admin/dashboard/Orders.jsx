import React, { useState } from "react";
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

const Orders = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    total: "",
    status: "",
  });

  const [orders, setOrders] = useState([
    { id: 1, customer: "Nguyễn Văn A", total: "500.000", status: "Completed" },
    { id: 2, customer: "Trần Thị B", total: "750.000", status: "Pending" },
  ]);

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = () => {
    if (newOrder.customer && newOrder.total && newOrder.status) {
      setOrders([...orders, { id: orders.length + 1, ...newOrder }]);
      setNewOrder({ customer: "", total: "", status: "" });
      handleClose();
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "70px" }}>
          {/* Thanh tìm kiếm + Nút thêm đơn hàng */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Search by customer..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Button variant="contained" color="success" onClick={handleOpen}>
              Create Order
            </Button>
          </div>

          {/* Bảng hiển thị Orders */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.total} VNĐ</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Link to={`/view-order/${order.id}`}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          View
                        </Button>
                      </Link>
                      <Link to={`/edit-order/${order.id}`}>
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

          {/* Popup Create Order */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogContent>
              <TextField
                label="Customer Name"
                name="customer"
                fullWidth
                margin="dense"
                value={newOrder.customer}
                onChange={handleChange}
              />
              <TextField
                label="Total Amount"
                name="total"
                fullWidth
                margin="dense"
                value={newOrder.total}
                onChange={handleChange}
              />
              <TextField
                label="Status"
                name="status"
                fullWidth
                margin="dense"
                value={newOrder.status}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
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

export default Orders;

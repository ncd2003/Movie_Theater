import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, Select, FormControl, Box, Avatar, Typography, Divider, Grid,
    Checkbox, FormControlLabel
} from "@mui/material";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import AccountApi from "../../../api/AccountApi";

const AccountManagement = () => {
    const [search, setSearch] = useState("");
    const [account, setAccount] = useState([]);

    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [roleFilter, setRoleFilter] = useState({
        EMPLOYEE: false,
        MEMBER: false,
    });

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [newAccount, setNewAccount] = useState({
        fullName: "", email: "", gender: "", password: "", phoneNumber: "", role: ""
    });

    useEffect(() => {
        fetchAllAccounts();
    }, []);

    const fetchAllAccounts = async () => {
        try {
            const response = await AccountApi.listAccounts();
            setAccount(response.data);
        } catch (error) {
            toast.error("Failed to fetch accounts");
        }
    };

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const handleOpenView = (account) => {
        setSelectedAccount(account);
        setOpenView(true);
    };
    const handleCloseView = () => setOpenView(false);

    const handleOpenEdit = (account) => {
        setSelectedAccount(account);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const handleChangeNewAccount = (e) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    };

    const handleChangeEditAccount = (event) => {
        const { name, value } = event.target;

        // Giữ nguyên dữ liệu cũ, chỉ cập nhật field thay đổi
        setSelectedAccount((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateAccount = async () => {
        if (!newAccount.fullName || !newAccount.email || !newAccount.gender || !newAccount.password || !newAccount.phoneNumber || !newAccount.role) {
            toast.error("All fields are required!");
            return;
        }
        try {
            await AccountApi.addAccount(newAccount);
            toast.success("Account added successfully!");
            await fetchAllAccounts();
            handleCloseAdd();
        } catch (error) {
            toast.error("Failed to add account");
        }
    };

    const handleUpdateAccount = async () => {
        try {
            await AccountApi.updateAccount(selectedAccount.accountId, selectedAccount);
            toast.success("Account updated successfully!");
            await fetchAllAccounts();
            handleCloseEdit();
        } catch (error) {
            toast.error("Failed to update Account");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;

        try {
            await AccountApi.deleteAccount(id);
            toast.success("Account deleted successfully!");
            fetchAllAccounts();
        } catch (error) {
            toast.error("Failed to delete account");
        }
    };

    // const filteredAccount = account.filter((account) =>
    //     account.fullName.toLowerCase().includes(search.toLowerCase())
    // );

    // Lọc danh sách tài khoản theo role
    const filteredAccount = account.filter((acc) => {
        if (!roleFilter.EMPLOYEE && !roleFilter.MEMBER && !roleFilter.ADMIN) return true; // Nếu không chọn gì, hiển thị tất cả
        return roleFilter[acc.role]; // Chỉ hiển thị role được chọn
    });

    // Xử lý khi người dùng chọn filter
    const handleFilterChange = (event) => {
        setRoleFilter({
            ...roleFilter,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                <Navbar />
                <div style={{ padding: "70px" }}>
                    {/* Bộ lọc role */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={roleFilter.EMPLOYEE}
                                    onChange={handleFilterChange}
                                    name="EMPLOYEE"
                                    color="primary"
                                />
                            }
                            label="Employee"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={roleFilter.MEMBER}
                                    onChange={handleFilterChange}
                                    name="MEMBER"
                                    color="primary"
                                />
                            }
                            label="Member"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={roleFilter.ADMIN}
                                    onChange={handleFilterChange}
                                    name="ADMIN"
                                    color="primary"
                                />
                            }
                            label="Admin"
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <TextField
                            label="Search by account name..."
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "250px", marginRight: "10px" }}
                        />
                        <Button variant="contained" color="success" onClick={handleOpenAdd}>
                            Add Account
                        </Button>
                    </div>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAccount.map((account) => (
                                    <TableRow key={account.accountId}>
                                        <TableCell>{account.accountId}</TableCell>
                                        <TableCell>{account.fullName}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{account.gender}</TableCell>
                                        <TableCell>{account.role}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" size="small" onClick={() => handleOpenView(account)}>View</Button>
                                            <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(account)}>Edit</Button>
                                            <Button variant="contained" color="error" size="small" style={{ marginLeft: "5px" }} onClick={() => handleDelete(account.accountId)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Dialog Add account */}
                    <Dialog open={openAdd} onClose={handleCloseAdd}>
                        <DialogTitle>Add New Account</DialogTitle>
                        <DialogContent>
                            <TextField label="Full Name" name="fullName" fullWidth margin="dense" onChange={handleChangeNewAccount} />
                            <TextField label="Email" name="email" fullWidth margin="dense" onChange={handleChangeNewAccount} />
                            <TextField label="Password" name="password" type="password" fullWidth margin="dense" onChange={handleChangeNewAccount} />
                            <TextField label="Phone Number" name="phoneNumber" fullWidth margin="dense" onChange={handleChangeNewAccount} />
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name="gender"
                                    value={newAccount.gender}
                                    onChange={handleChangeNewAccount}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Gender
                                    </MenuItem>
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name="role"
                                    value={newAccount.role || ""}
                                    onChange={handleChangeNewAccount}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Role
                                    </MenuItem>
                                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                                    <MenuItem value="MEMBER">Member</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAdd} color="secondary">Cancel</Button>
                            <Button onClick={handleCreateAccount} color="primary" variant="contained">Add</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openView} onClose={handleCloseView} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
                            Account Details
                        </DialogTitle>
                        <DialogContent dividers sx={{ padding: "20px" }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2", fontSize: "32px", marginBottom: "10px" }}>
                                    {selectedAccount?.fullName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                    {selectedAccount?.fullName}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {selectedAccount?.email}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                {/* Gender */}
                                <Grid item xs={6}>
                                    <Typography variant="body1" fontWeight="bold">Gender:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{selectedAccount?.gender}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", my: 1 }} /> {/* Ngăn cách Gender và Role */}
                                {/* Role */}
                                <Grid item xs={6}>
                                    <Typography variant="body1" fontWeight="bold">Role:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{selectedAccount?.role}</Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleCloseView} color="secondary" variant="contained" fullWidth>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Dialog Edit Account */}
                    <Dialog open={openEdit} onClose={handleCloseEdit}>
                        <DialogTitle>Edit Account</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Full Name"
                                name="fullName"
                                fullWidth
                                margin="dense"
                                value={selectedAccount?.fullName || ""}
                                onChange={handleChangeEditAccount}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                margin="dense"
                                value={selectedAccount?.email || ""}
                                onChange={handleChangeEditAccount}
                            />
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                fullWidth
                                margin="dense"
                                value={selectedAccount?.phoneNumber || ""}
                                onChange={handleChangeEditAccount}
                            />
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name="gender"
                                    value={selectedAccount?.gender || ""}
                                    onChange={handleChangeEditAccount}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name="role"
                                    value={selectedAccount?.role || ""}
                                    onChange={handleChangeEditAccount}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select Role</MenuItem>
                                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                                    <MenuItem value="MEMBER">Member</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
                            <Button onClick={handleUpdateAccount} color="primary" variant="contained">Save</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AccountManagement;

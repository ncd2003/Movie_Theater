import React, { useEffect, useState } from 'react'
import { handleApiRequest } from '../../../utils/ApiHandler';
import AccountApi from '../../../api/AccountApi';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, MenuItem, Paper, Select, TextField } from '@mui/material';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "../../../components/ui/table";
import RoleApi from '../../../api/RoleApi';
import { formatDateToDDMMYYY, formatDateToDDMMYYYHHMMSS } from "../../../utils/DateFormat";
import { Cancel, CheckCircle } from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import Access from '../../../utils/Access'
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";

const AccountManagement = () => {
    const [search, setSearch] = useState('');
    const [listAccount, setListAccount] = useState([]);
    const [listRoleDTO, setListRoleDTO] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newAccount, setNewAccount] = useState(
        {
            email: '',
            phoneNumber: '',
            identityCard: '',
            fullName: '',
            password: '',
            address: '',
            birthDate: '',
            gender: '',
            role: null
        }
    );
    const [id, setId] = useState();
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
    const [errors, setErrors] = useState({});



    const PinkSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: green[600],
            '&:hover': {
                backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: green[600],
        },
    }));

    const label = { inputProps: { 'aria-label': 'Color switch demo' } };


    useEffect(() => {
        fetchAllListAccount();
        fetchAllListRoleDTO();
    }, [])

    const fetchAllListAccount = async () => {
        await handleApiRequest({
            apiCall: () => AccountApi.listAccounts(),
            onSuccess: (res) => {
                setListAccount(res.data);
            },
            showSuccessToast: false
        })
    };

    const fetchAllListRoleDTO = async () => {
        await handleApiRequest({
            apiCall: () => RoleApi.listRoleDto(),
            onSuccess: (res) => {
                setListRoleDTO(res.data);
                setSelectedRoleId(res.data[2].roleId);
            },
            showSuccessToast: false
        })
    };
    const handleDetailAccount = async (st) => {
        setOpenDetailDialog(true);
        setSelectedAccount(st);
    };

    const handleChange = (e) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value })
    }
    const handleOpenCreate = () => {
        setNewAccount({
            email: '',
            phoneNumber: '',
            identityCard: '',
            fullName: '',
            password: '',
            address: '',
            birthDate: '',
            gender: '',
            role: null
        })
        setOpen(true);
        setEditMode(false);
    }

    const handleOpenEdit = (account) => {
        setOpen(true);
        setEditMode(true);
        setId(account.accountId);
        setNewAccount(account);
    }
    const validateForm = () => {
        let tempErrors = {};
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const idRegex = /^\d{9,12}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const today = new Date().toISOString().split("T")[0];
        if (!newAccount.fullName.trim()) {
            tempErrors.fullName = "Full name is required";
        }
        if (!emailRegex.test(newAccount.email)) {
            tempErrors.email = "Invalid email format.";
        }
        if (!phoneRegex.test(newAccount.phoneNumber)) {
            tempErrors.phoneNumber = "Phone number must be exactly 10 digits.";
        }
        if (!idRegex.test(newAccount.identityCard)) {
            tempErrors.identityCard = "Identity Card must be 9-12 digits.";
        }
        if (newAccount.address.trim().length < 5) {
            tempErrors.address = "Address must be at least 5 characters.";
        }
        if (!newAccount.birthDate) {
            tempErrors.birthDate = "Birthdate is required.";
        } else if (newAccount.birthDate >= today) {
            tempErrors.birthDate = "Birthdate must be in the past.";
        }
        if (!passwordRegex.test(newAccount.password)) {
            tempErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, and a number.";
        }
        if (!newAccount.gender) {
            tempErrors.gender = "Please select a gender.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validateForm()) return;
        let roleDB = null;
        await handleApiRequest({
            apiCall: () => RoleApi.fetchPermissionRoleById(selectedRoleId),
            onSuccess: (res) => {
                roleDB = res.data
                fetchAllListAccount();
            },
            showSuccessToast: false,
        })

        const formattedData = { ...newAccount, role: roleDB };
        const apiCall = editMode ? () => AccountApi.updateAccount(id, formattedData) : () => AccountApi.addAccount(formattedData);
        const successMessage = editMode ? "Update account successfully" : "Create new account successfully";
        await handleApiRequest({
            apiCall,
            onSuccess: () => {
                fetchAllListAccount();
                setOpen(false);
            },
            successMessage
        });
    };
    const handleDeleteAccount = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this account?");

        if (!isConfirmed) return; // Nếu người dùng bấm Cancel, thoát khỏi hàm

        await handleApiRequest({
            apiCall: () => AccountApi.deleteAccount(id),
            onSuccess: () => {
                fetchAllListAccount();
            },
            successMessage: "Delete account successfully"
        });
    };
    // Filter movies based on search input
    const filteredAccount = listAccount
        .filter((account) => account?.email.toLowerCase().includes(search?.toLowerCase()))
        .filter((account) => (selectedRoleFilter ? account.role?.roleId === selectedRoleFilter : true));

    const handleToggleStatus = async (accountId, currentStatus) => {
        const currentAccountId = parseInt(localStorage.getItem('accountId'));
        console.log(currentAccountId);
        if (accountId === currentAccountId) {
            toast.error("You can not ban your account!");
            return;
        }
        const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        await handleApiRequest({
            apiCall: () => AccountApi.updateStatus(accountId, newStatus),
            onSuccess: () => fetchAllListAccount(),
            successMessage: `Account ${newStatus.toLowerCase()} successfully.`
        });
    };


    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ padding: "70px" }}>
                    {/* Search & Create Button */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <TextField
                                label="Search by email..."
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "250px" }}
                            />
                            <FormControl size="small" style={{ minWidth: 200 }}>
                                <Select
                                    value={selectedRoleFilter}
                                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">All Roles</MenuItem>
                                    {listRoleDTO.map((role) => (
                                        <MenuItem key={role.roleId} value={role.roleId}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Access permission={{ method: "POST", apiPath: "/api/v1/account", module: "Account" }} hideChildren>
                            <Button variant="contained" color="success" onClick={handleOpenCreate}>
                                Create Account
                            </Button>
                        </Access>
                    </div>


                    {/* Seat Types Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>FullName</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAccount.length > 0 ? (
                                    filteredAccount.map((account) => (
                                        <TableRow key={account.accountId}>
                                            <TableCell>{account.accountId}</TableCell>
                                            <TableCell>{account.email}</TableCell>
                                            <TableCell>{account.fullName}</TableCell>
                                            <TableCell>{account.gender}</TableCell>
                                            <TableCell>{account.role?.roleName}</TableCell>
                                            <TableCell>
                                                <PinkSwitch
                                                    {...label}
                                                    checked={account.status === "ACTIVE"}
                                                    onChange={() => handleToggleStatus(account.accountId, account.status)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small" onClick={() => handleDetailAccount(account)}>
                                                    Detail
                                                </Button>
                                                <Access permission={{ method: "PUT", apiPath: "/api/v1/account/{id}", module: "Account" }} hideChildren>
                                                    <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(account)}>
                                                        Edit
                                                    </Button>
                                                </Access>
                                                <Access permission={{ method: "DELETE", apiPath: "/api/v1/account/{id}", module: "Account" }} hideChildren>
                                                    <Button variant="contained" color="error" size="small" style={{ marginLeft: "5px" }} onClick={() => handleDeleteAccount(account.accountId)}>
                                                        Delete
                                                    </Button>
                                                </Access>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "20px" }}
                                        >
                                            No account found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Create/Edit Seat Type Dialog */}
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{editMode ? "Edit Account" : "Create Account"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Full name"
                                name="fullName"
                                fullWidth
                                margin="dense"
                                type="text"
                                value={newAccount.fullName}
                                required
                                onChange={handleChange}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type='email'
                                fullWidth
                                margin="dense"
                                value={newAccount.email}
                                required
                                onChange={handleChange}
                                error={errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                label="Phone number"
                                name="phoneNumber"
                                type='text'
                                fullWidth
                                margin="dense"
                                value={newAccount.phoneNumber}
                                required
                                onChange={handleChange}
                                error={errors.phoneNumber}
                                helperText={errors.phoneNumber}
                            />
                            <TextField
                                label="Identity card"
                                name="identityCard"
                                fullWidth
                                margin="dense"
                                type="text"
                                value={newAccount.identityCard}
                                required
                                onChange={handleChange}
                                error={!!errors.identityCard}
                                helperText={errors.identityCard}
                            />
                            <TextField
                                label="Address"
                                name="address"
                                fullWidth
                                margin="dense"
                                type="text"
                                value={newAccount.address}
                                required
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                            />
                            <TextField
                                label="Birth Date"
                                name="birthDate"
                                type='date'
                                fullWidth
                                margin="dense"
                                value={newAccount.birthDate || ""}
                                required
                                onChange={handleChange}
                                error={errors.birthDate}
                                helperText={errors.birthDate}
                            />
                            {!editMode ?
                                <TextField
                                    label="Password"
                                    name="password"
                                    type='password'
                                    fullWidth
                                    margin="dense"
                                    value={newAccount.password}
                                    required
                                    onChange={handleChange}
                                    error={errors.password}
                                    helperText={errors.password}
                                />
                                : null}
                            <FormControl fullWidth margin="dense" error={!!errors.gender}>
                                <Select
                                    name="gender"
                                    value={newAccount.gender}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Gender
                                    </MenuItem>
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </Select>
                                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <Select
                                    name="role"
                                    value={selectedRoleId}
                                    onChange={(e) => setSelectedRoleId(e.target.value)}
                                    displayEmpty
                                >
                                    {
                                        listRoleDTO?.map((r) => (
                                            <MenuItem key={r.roleId} value={r.roleId}>
                                                {r.roleName}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleSubmit} color="primary" variant="contained">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Seat Type Detail Dialog */}
                    <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
                        <DialogTitle>Account Details</DialogTitle>
                        <DialogContent>
                            {selectedAccount && (
                                <>
                                    <TextField
                                        label="Phone number"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.phoneNumber ? selectedAccount.phoneNumber : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Identity card"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.identityCard ? selectedAccount.identityCard : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Address"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.address ? selectedAccount.address : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Birth date"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.birthDate ? formatDateToDDMMYYY(selectedAccount.birthDate) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.createdBy ? selectedAccount.createdBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.createdAt ? formatDateToDDMMYYYHHMMSS(selectedAccount.createdAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.updatedBy ? selectedAccount.updatedBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedAccount.updatedAt ? formatDateToDDMMYYYHHMMSS(selectedAccount.updatedAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetailDialog(false)} color="secondary">Close</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default AccountManagement
import React, { useEffect, useState } from 'react';
import { handleApiRequest } from '../../../utils/ApiHandler';
import PermissionApi from '../../../api/PermissionApi';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    FormControlLabel, FormHelperText, InputLabel, MenuItem, Paper, Select, Switch, TextField
} from '@mui/material';

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "../../../components/ui/table";
import Access from '../../../utils/Access'
const PermissionManagement = () => {
    const [search, setSearch] = useState('');
    const [listPermission, setListPermission] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newPermission, setNewPermission] = useState({ name: '', apiPath: '', method: '', module: '' });
    const [id, setId] = useState();
    const [errors, setErrors] = useState({});
    const [filterMethod, setFilterMethod] = useState('');
    const [filterModule, setFilterModule] = useState('');
    useEffect(() => {
        fetchAllListPermission();
    }, []);

    const fetchAllListPermission = async () => {
        await handleApiRequest({
            apiCall: () => PermissionApi.listPermission(),
            onSuccess: (res) => setListPermission(res.data),
            showSuccessToast: false
        });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!newPermission.name.trim()) {
            tempErrors.name = "Permission name is required.";
        }
        if (!newPermission.apiPath.trim()) {
            tempErrors.apiPath = "Api path is required.";
        }
        if (!newPermission.module.trim()) {
            tempErrors.module = "Module is required.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setNewPermission(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    // console.log(newPermission);

    const handleDetailPermission = async (permission) => {
        setOpenDetailDialog(true);
        setSelectedPermission(permission);
    };
    
    const handleOpenCreate = () => {
        setNewPermission({ name: '', apiPath: '', method: 'GET', module: listPermission[0].module });
        setOpen(true);
        setEditMode(false);
        setErrors({});
    };

    const handleOpenEdit = (permission) => {
        setOpen(true);
        setEditMode(true);
        setId(permission.id);
        setNewPermission(permission);
        setErrors({});
    };
    // console.log(id)
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const apiCall = editMode ? () => PermissionApi.updatePermission(id, newPermission) : () => PermissionApi.createPermission(newPermission);
        const successMessage = editMode ? " Permission updated successfully!" : " Permission created successfully!";

        await handleApiRequest({
            apiCall,
            onSuccess: () => {
                fetchAllListPermission();
                setOpen(false);
            },
            successMessage
        });
    };

    const handleDeletePermission = async (permissionId) => {
        if (window.confirm("Are you sure you want to delete this permission?")) {
            await handleApiRequest({
                apiCall: () => PermissionApi.deletePermission(permissionId),
                onSuccess: () => {
                    fetchAllListPermission();
                },
                successMessage: "Permission delete successfull!"
            })
        }
    }
    // Filter movies based on search input
    const filteredMovies = listPermission.filter((permission) =>
        permission?.name.toLowerCase().includes(search?.toLowerCase()) &&
        (filterMethod ? permission.method === filterMethod : true) &&
        (filterModule ? permission.module === filterModule : true)
    );

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ padding: "60px" }}>
                    {/* Search & Create Button */}
                    <div style={{ padding: "10px" }}>
                        {/* Search, Filters & Create Button */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                            {/* Search & Filters (Cùng hàng) */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <TextField
                                    label="Search by name..."
                                    variant="outlined"
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ width: "250px" }}
                                />

                                {/* Filter Method */}
                                <FormControl variant="outlined" size="small" style={{ width: "180px" }}>
                                    <InputLabel>Method</InputLabel>
                                    <Select
                                        value={filterMethod}
                                        onChange={(e) => setFilterMethod(e.target.value)}
                                        label="Method"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="GET">GET</MenuItem>
                                        <MenuItem value="POST">POST</MenuItem>
                                        <MenuItem value="PUT">PUT</MenuItem>
                                        <MenuItem value="PATCH">PATCH</MenuItem>
                                        <MenuItem value="DELETE">DELETE</MenuItem>
                                        <MenuItem value="HEAD">HEAD</MenuItem>
                                        <MenuItem value="OPTIONS">OPTIONS</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Filter Module */}
                                <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
                                    <InputLabel>Module</InputLabel>
                                    <Select
                                        value={filterModule}
                                        onChange={(e) => setFilterModule(e.target.value)}
                                        label="Module"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {Array.from(new Set(listPermission.map(p => p.module))).map((module) => (
                                            <MenuItem key={module} value={module}>{module}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Create Button */}
                            <Access permission={{ method: "POST", apiPath: "/api/v1/permission", module: "Permission" }} hideChildren>
                                <Button variant="contained" color="success" onClick={handleOpenCreate}>
                                    Create permission
                                </Button>
                            </Access>
                        </div>
                    </div>


                    {/*  Permission Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Api Path</TableCell>
                                    <TableCell>Method</TableCell>
                                    <TableCell>Module</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMovies.length > 0 ? (
                                    filteredMovies.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell>{permission.id}</TableCell>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell>{permission.apiPath}</TableCell>
                                            <TableCell>{permission.method}</TableCell>
                                            <TableCell>{permission.module}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    style={{ marginLeft: "5px" }}
                                                    onClick={() => handleDetailPermission(permission)}
                                                >
                                                    Detail
                                                </Button>
                                                <Access permission={{ method: "PUT", apiPath: "/api/v1/permission/{id}", module: "Permission" }} hideChildren>
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        style={{ marginLeft: "5px" }}
                                                        onClick={() => handleOpenEdit(permission)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Access>
                                                <Access permission={{ method: "DELETE", apiPath: "/api/v1/permission/{id}", module: "Permission" }} hideChildren>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        style={{ marginLeft: "5px" }}
                                                        onClick={() => handleDeletePermission(permission.id)}>Delete</Button>
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
                                            No permission found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Create/Edit Dialog */}
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{editMode ? "Edit Permission" : "Create Permission"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                margin="dense"
                                value={newPermission.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                            <TextField
                                label="Api Path"
                                name="apiPath"
                                fullWidth
                                margin="dense"
                                value={newPermission.apiPath}
                                onChange={handleChange}
                                error={!!errors.apiPath}
                                helperText={errors.apiPath}
                            />
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>Method</InputLabel>
                                <Select
                                    name="method"
                                    value={newPermission.method ? newPermission.method : "GET"}
                                    onChange={handleChange}
                                    label="Method"
                                >
                                    <MenuItem value="GET" sx={{ color: "green" }}>GET</MenuItem>
                                    <MenuItem value="POST" sx={{ color: "goldenrod" }}>POST</MenuItem>
                                    <MenuItem value="PUT" sx={{ color: "blue" }}>PUT</MenuItem>
                                    <MenuItem value="PATCH" sx={{ color: "purple" }}>PATCH</MenuItem>
                                    <MenuItem value="DELETE" sx={{ color: "red" }}>DELETE</MenuItem>
                                    <MenuItem value="HEAD" sx={{ color: "green" }}>HEAD</MenuItem>
                                    <MenuItem value="OPTIONS" sx={{ color: "darkmagenta" }}>OPTIONS</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Hardcoded Module Select */}
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <InputLabel>Module</InputLabel>
                                <Select
                                    name="module"
                                    value={newPermission.module}
                                    onChange={handleChange}
                                    label="Module"
                                >
                                    <MenuItem value="Account">Account</MenuItem>
                                    <MenuItem value="CinemaRoom">CinemaRoom</MenuItem>
                                    <MenuItem value="Invoice">Invoice</MenuItem>
                                    <MenuItem value="Movie">Movie</MenuItem>
                                    <MenuItem value="Permission">Permission</MenuItem>
                                    <MenuItem value="Promotion">Promotion</MenuItem>
                                    <MenuItem value="Role">Role</MenuItem>
                                    <MenuItem value="Schedule">Schedule</MenuItem>
                                    <MenuItem value="ScheduleSeat">ScheduleSeat</MenuItem>
                                    <MenuItem value="Seat">Seat</MenuItem>
                                    <MenuItem value="SeatStatus">SeatStatus</MenuItem>
                                    <MenuItem value="SeatType">SeatType</MenuItem>
                                    <MenuItem value="ShowDate">ShowDate</MenuItem>
                                    <MenuItem value="Type">Type</MenuItem>
                                    <MenuItem value="File">File</MenuItem>
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
                        </DialogActions>
                    </Dialog>

                    {/*  Permission Detail Dialog */}
                    <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
                        <DialogTitle> Permission Details</DialogTitle>
                        <DialogContent>
                            {selectedPermission && (
                                <>
                                    <TextField
                                        label="Create By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedPermission.createdBy ? selectedPermission.createdBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedPermission.createdAt ? selectedPermission.createdAt : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedPermission.updatedBy ? selectedPermission.updatedBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedPermission.updatedAt ? selectedPermission.updatedAt : "N/A"}
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
    );
};

export default PermissionManagement;

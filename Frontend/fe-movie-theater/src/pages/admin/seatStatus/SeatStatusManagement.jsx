import React, { useEffect, useState } from 'react';
import { handleApiRequest } from '../../../utils/ApiHandler';
import SeatStatusApi from '../../../api/SeatStatusApi';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, Paper, Switch, TextField
} from '@mui/material';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "../../../components/ui/table";
import Access from '../../../utils/Access';
import { formatDateToDDMMYYYHHMMSS } from "../../../utils/DateFormat";
import AuthApi from '../../../api/AuthApi';
const SeatStatusManagement = () => {
    const [search, setSearch] = useState('');
    const [listSeatStatus, setListSeatStatus] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedSeatStatus, setSelectedSeatStatus] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newSeatStatus, setNewSeatStatus] = useState({ seatStatusName: '', seatStatusColour: '#000000', isSelectable: true });
    const [id, setId] = useState();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAllListSeatStatus();
    }, []);

    const fetchAllListSeatStatus = async () => {
        await handleApiRequest({
            apiCall: () => SeatStatusApi.getListSeatStatus(),
            onSuccess: (res) => {
                setListSeatStatus(res.data)
                // console.log(res.data)
            }
            ,
            showSuccessToast: false
        });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!newSeatStatus.seatStatusName.trim()) {
            tempErrors.seatStatusName = "Seat Status Name is required.";
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(newSeatStatus.seatStatusColour)) {
            tempErrors.seatStatusColour = "Enter a valid hex color (e.g., #FF5733).";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setNewSeatStatus({ ...newSeatStatus, [e.target.name]: e.target.value });
    };

    const handleDetailSeatStatus = async (ss) => {
        setOpenDetailDialog(true);
        setSelectedSeatStatus(ss);
        console.log(ss)
    };

    const handleOpenCreate = () => {
        setNewSeatStatus({ seatStatusName: '', seatStatusColour: '#000000', isSelectable: true });
        setOpen(true);
        setEditMode(false);
        setErrors({});
    };

    const handleOpenEdit = (st) => {
        setOpen(true);
        setEditMode(true);
        setId(st.seatStatusId);
        setNewSeatStatus(st);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const apiCall = editMode ? () => SeatStatusApi.updateSeatStatus(id, newSeatStatus) : () => SeatStatusApi.createSeatStatus(newSeatStatus);
        const successMessage = editMode ? "Seat Status updated successfully!" : "Seat Status created successfully!";

        await handleApiRequest({
            apiCall,
            onSuccess: () => {
                fetchAllListSeatStatus();
                setOpen(false);
            },
            successMessage
        });
    };

    const handleDeleteSeatStatus = async (id) => {
        if (window.confirm("Are you sure you want to delete this seat status?")) {
            await handleApiRequest({
                apiCall: () => SeatStatusApi.deleteSeatStatus(id),
                onSuccess: fetchAllListSeatStatus,
                successMessage: "Seat Status deleted successfully!"
            });
        }
    };
    // Filter movies based on search input
    const filteredSeatStatus = listSeatStatus?.filter((seatStatus) =>
        seatStatus?.seatStatusName.toLowerCase().includes(search?.toLowerCase())
    );

    return (

        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ padding: "70px" }}>
                    {/* Search & Create Button */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", justifyContent: "space-between" }}>
                        <TextField
                            label="Search by name..."
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "250px", marginRight: "10px" }}
                        />
                        <Access permission={{ method: "POST", apiPath: "/api/v1/seat-status", module: "SeatStatus" }} hideChildren>
                            <Button variant="contained" color="success" onClick={handleOpenCreate}>
                                Create Seat Status
                            </Button>
                        </Access>
                    </div>

                    {/* Seat Status Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Colour</TableCell>
                                    <TableCell>Is Selectable</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSeatStatus.length > 0 ? (
                                    filteredSeatStatus.map((ss) => (
                                        <TableRow key={ss.seatStatusId}>
                                            <TableCell>{ss.seatStatusId}</TableCell>
                                            <TableCell>{ss.seatStatusName}</TableCell>
                                            <TableCell>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {ss.seatStatusColour}
                                                    <div style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        backgroundColor: ss.seatStatusColour,
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px"
                                                    }}></div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{ss.isSelectable ? "✅ Yes" : "❌ No"}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small" onClick={() => handleDetailSeatStatus(ss)}>Detail</Button>
                                                <Access permission={{ method: "PUT", apiPath: "/api/v1/seat-status/{id}", module: "SeatStatus" }} hideChildren>
                                                    <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(ss)}>Edit</Button>
                                                </Access>
                                                <Access permission={{ method: "DELETE", apiPath: "/api/v1/seat-status/{id}", module: "SeatStatus" }} hideChildren>
                                                    <Button variant="contained" color="error" size="small" style={{ marginLeft: "5px" }} onClick={() => handleDeleteSeatStatus(ss.seatStatusId)}>Delete</Button>
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
                                            No seat status found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Create/Edit Dialog */}
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{editMode ? "Edit Seat Status" : "Create Seat Status"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Name"
                                name="seatStatusName"
                                fullWidth
                                margin="dense"
                                value={newSeatStatus.seatStatusName}
                                onChange={handleChange}
                                error={!!errors.seatStatusName}
                                helperText={errors.seatStatusName}
                            />
                            <TextField
                                label="Colour"
                                name="seatStatusColour"
                                fullWidth
                                margin="dense"
                                type="color"
                                value={newSeatStatus.seatStatusColour}
                                onChange={handleChange}
                                error={!!errors.seatStatusColour}
                                helperText={errors.seatStatusColour}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={newSeatStatus.isSelectable}
                                        onChange={(e) => setNewSeatStatus({ ...newSeatStatus, isSelectable: e.target.checked })}
                                    />
                                }
                                label="Is Selectable"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                            <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
                        </DialogActions>
                    </Dialog>
                    {/* Seat Status Detail Dialog */}
                    <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
                        <DialogTitle>Seat Status Details</DialogTitle>
                        <DialogContent>
                            {selectedSeatStatus && (
                                <>
                                    <TextField
                                        label="Create By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatStatus.createdBy ? selectedSeatStatus.createdBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatStatus.createdAt ? formatDateToDDMMYYYHHMMSS(selectedSeatStatus.createdAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatStatus.updatedBy ? selectedSeatStatus.updatedBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatStatus.updatedAt ? formatDateToDDMMYYYHHMMSS(selectedSeatStatus.updatedAt) : "N/A"}
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
        </div >
    );
};

export default SeatStatusManagement;

import React, { useEffect, useState } from 'react'
import { handleApiRequest } from '../../../utils/ApiHandler';
import SeatTypeApi from '../../../api/SeatTypeApi';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from '@mui/material';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "../../../components/ui/table";
import Access from '../../../utils/Access'
import {formatDateToDDMMYYYHHMMSS } from "../../../utils/DateFormat";
const SeatTypeManagement = () => {
    const [search, setSearch] = useState('');
    const [listSeatType, setListSeatType] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedSeatType, setSelectedSeatType] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newSeatType, setNewSeatType] = useState({ seatTypeName: '', seatTypePrice: '', seatTypeColour: '#000000' });
    const [id, setId] = useState();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAllListSeatType();
    }, [])

    const fetchAllListSeatType = async () => {
        await handleApiRequest({
            apiCall: () => SeatTypeApi.listSeatType(),
            onSuccess: (res) => {
                setListSeatType(res.data);
            },
            showSuccessToast: false
        })
    };
    const handleDetailSeatType = async (st) => {
        setOpenDetailDialog(true);
        setSelectedSeatType(st);
    };

    const handleChange = (e) => {
        setNewSeatType({ ...newSeatType, [e.target.name]: e.target.value })
    }
    const handleOpenCreate = () => {
        setNewSeatType({ seatTypeName: '', seatTypeColour: '#00000', seatTypePrice: '' })
        setOpen(true);
        setEditMode(false);
    }

    const handleOpenEdit = (st) => {
        setOpen(true);
        setEditMode(true);
        setId(st.seatTypeId);
        setNewSeatType(st);
    }
    const validateForm = () => {
        let tempErrors = {};
        if (!newSeatType.seatTypeName.trim()) {
            tempErrors.seatTypeName = "Seat Type Name is required.";
        }
        if (!newSeatType.seatTypePrice) {
            tempErrors.seatTypePrice = "Seat Type Price is required.";
        } if (newSeatType.seatTypePrice < 0) {
            tempErrors.seatTypePrice = "Seat Type Price must to bigger than zero.";
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(newSeatType.seatTypeColour)) {
            tempErrors.seatTypeColour = "Enter a valid hex color (e.g., #FF5733).";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        const apiCall = editMode ? () => SeatTypeApi.updateSeatType(id, newSeatType) : () => SeatTypeApi.createSeatType(newSeatType);
        const successMessage = editMode ? "Update seat type successfully" : "Create new seat type successfully";
        await handleApiRequest({
            apiCall,
            onSuccess: () => {
                fetchAllListSeatType();
                setOpen(false);
            },
            successMessage
        });
    };
    const handleDeleteSeatType = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this seat type?");

        if (!isConfirmed) return; // Nếu người dùng bấm Cancel, thoát khỏi hàm

        await handleApiRequest({
            apiCall: () => SeatTypeApi.deleteSeatType(id),
            onSuccess: () => {
                fetchAllListSeatType();
            },
            successMessage: "Delete seat type successfully"
        });
    };
    // Filter movies based on search input
    const filteredSeatType = listSeatType.filter((seatType) =>
        seatType?.seatTypeName.toLowerCase().includes(search?.toLowerCase())
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
                        <Access permission={{ method: "POST", apiPath: "/api/v1/seat-type", module: "SeatType" }} hideChildren>
                            <Button variant="contained" color="success" onClick={handleOpenCreate}>
                                Create Seat Type
                            </Button>
                        </Access>
                    </div>

                    {/* Seat Types Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Colour</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSeatType.length > 0 ? (
                                    filteredSeatType.map((st) => (
                                        <TableRow key={st.seatTypeId}>
                                            <TableCell>{st.seatTypeId}</TableCell>
                                            <TableCell>{st.seatTypeName}</TableCell>
                                            <TableCell>{st.seatTypePrice.toLocaleString("vi-VN")} VND</TableCell>
                                            <TableCell>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {st.seatTypeColour}
                                                    <div
                                                        style={{
                                                            width: "20px",
                                                            height: "20px",
                                                            backgroundColor: st.seatTypeColour,
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px"
                                                        }}
                                                    ></div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small" onClick={() => handleDetailSeatType(st)}>
                                                    Detail
                                                </Button>
                                                <Access permission={{ method: "PUT", apiPath: "/api/v1/seat-type/{id}", module: "SeatType" }} hideChildren>
                                                    <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(st)}>
                                                        Edit
                                                    </Button>
                                                </Access>
                                                <Access permission={{ method: "DELETE", apiPath: "/api/v1/seat-type/{id}", module: "SeatType" }} hideChildren>
                                                    <Button variant="contained" color="error" size="small" style={{ marginLeft: "5px" }} onClick={() => handleDeleteSeatType(st.seatTypeId)}>
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
                                            No seat type found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Create/Edit Seat Type Dialog */}
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{editMode ? "Edit Seat Type" : "Create Seat Type"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Name"
                                name="seatTypeName"
                                fullWidth
                                margin="dense"
                                value={newSeatType.seatTypeName}
                                required
                                onChange={handleChange}
                                error={errors.seatTypeName}
                                helperText={errors.seatTypeName}
                            />
                            <TextField
                                label="Price"
                                name="seatTypePrice"
                                fullWidth
                                margin="dense"
                                type="number"
                                value={newSeatType.seatTypePrice}
                                required
                                onChange={handleChange}
                                error={!!errors.seatTypePrice}
                                helperText={errors.seatTypePrice}
                            />
                            <TextField
                                label="Colour"
                                name="seatTypeColour"
                                fullWidth
                                margin="dense"
                                type='color'
                                value={newSeatType.seatTypeColour}
                                required
                                onChange={handleChange}
                                error={!!errors.seatTypeColour}
                                helperText={errors.seatTypeColour}
                            />
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
                        <DialogTitle>Seat Type Details</DialogTitle>
                        <DialogContent>
                            {selectedSeatType && (
                                <>
                                    <TextField
                                        label="Create By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatType.createdBy ? selectedSeatType.createdBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Create At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatType.createdAt ? formatDateToDDMMYYYHHMMSS(selectedSeatType.createdAt) : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update By"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatType.updatedBy ? selectedSeatType.updatedBy : "N/A"}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Update At"
                                        fullWidth
                                        margin="dense"
                                        value={selectedSeatType.updatedAt ? formatDateToDDMMYYYHHMMSS(selectedSeatType.updatedAt) : "N/A"}
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

export default SeatTypeManagement
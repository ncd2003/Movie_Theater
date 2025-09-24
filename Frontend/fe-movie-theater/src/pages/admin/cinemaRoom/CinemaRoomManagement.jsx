import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  DialogContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CinemaRoomApi from "../../../api/CinemaRoomApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
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
const CinemaRoomManagement = () => {
  const [open, setOpen] = useState(false);
  const [listCinemaRoom, setListCinemaRoom] = useState([]);
  const [search, setSearch] = useState('');
  const [newRoom, setNewRoom] = useState({ cinemaRoomName: '', seatQuantity: '' });
  const [editMode, setEditMode] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    fetchAllListRoom();
  }, []);

  const fetchAllListRoom = async () => {
    await handleApiRequest({
      apiCall: () => CinemaRoomApi.listCinemaRoom(),
      onSuccess: (res) => {
        setListCinemaRoom(res.data);
      },
      showSuccessToast: false,
    });
  };

  const handleChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    setEditMode(false);
    setNewRoom({ cinemaRoomName: '', seatQuantity: '' });
    setOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditMode(true);
    setNewRoom({ ...room });
    setOpen(true);
  };
  const validateForm = () => {
    let tempErrors = {};
    if (!newRoom.cinemaRoomName.trim()) {
      tempErrors.cinemaRoomName = "Cinema room name is required.";
    }
    if (newRoom.cinemaRoomName.length > 50) {
      tempErrors.cinemaRoomName = "Cinema room name can not longger than 50 characters.";
    }
    if (newRoom.seatQuantity <= 0) {
      tempErrors.seatQuantity = "Seat quantity must be bigger then zero.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const apiCall = editMode ? () =>
      CinemaRoomApi.updateCinemaRoom(newRoom.cinemaRoomId, { ...newRoom, seatQuantity: parseInt(newRoom.seatQuantity, 10), })
      : () => CinemaRoomApi.createANewRoom({
        ...newRoom, seatQuantity: parseInt(newRoom.seatQuantity),
      });
    const successMessage = editMode ? "Update cinema room successfully" : "Create new cinema room successfully";
    await handleApiRequest({
      apiCall,
      onSuccess: () => {
        fetchAllListRoom();
        setOpen(false);
      },
      successMessage
    });
  };

  const handleDetailRoom = (room) => {
    setSelectedRoom(room);
    setOpenDetailDialog(true);
  };

  const handleDeleteCinemaRoom = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this room?");

    if (!isConfirmed) return; // Nếu người dùng bấm Cancel, thoát khỏi hàm
    await handleApiRequest({
      apiCall: () => CinemaRoomApi.deleteCinemaRoom(id),
      onSuccess: () => {
        fetchAllListRoom();
      },
      successMessage: "Delete room successfully!",
    })
  }

  // Filter movies based on search input
  const filteredCinemaRoom = listCinemaRoom.filter((room) =>
    room?.cinemaRoomName.toLowerCase().includes(search?.toLowerCase())
  );
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "70px" }}>
          {/* Search & Create Button */}
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
            <Access permission={{ method: "POST", apiPath: "/api/v1/cinema-room", module: "CinemaRoom" }} hideChildren>
              <Button
                variant="contained"
                color="success"
                onClick={handleOpenCreate}
              >
                Create Room
              </Button>
            </Access>
          </div>

          {/* Cinema Rooms Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell className="w-24">Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCinemaRoom.length > 0 ? (
                  filteredCinemaRoom.map((room) => (
                    <TableRow key={room.cinemaRoomId}>
                      <TableCell>{room.cinemaRoomId}</TableCell>
                      <TableCell>{room.cinemaRoomName}</TableCell>
                      <TableCell>{room.seatQuantity}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleDetailRoom(room)}>
                          Detail
                        </Button>
                        <Access permission={{ method: "PUT", apiPath: "/api/v1/cinema-room/{id}", module: "CinemaRoom" }} hideChildren>
                          <Button variant="contained" color="warning" size="small" style={{ marginLeft: "5px" }} onClick={() => handleOpenEdit(room)}>
                            Edit
                          </Button>
                        </Access>
                        <Access permission={{ method: "DELETE", apiPath: "/api/v1/cinema-room/{id}", module: "CinemaRoom" }} hideChildren>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            style={{ marginLeft: "5px" }}
                            onClick={() => handleDeleteCinemaRoom(room.cinemaRoomId)}
                          >
                            Delete
                          </Button>
                        </Access>
                        <Link
                          to={
                            room.roomSizeRow === 0
                              ? `/admin/seats/setupSeats/${room.cinemaRoomId}`
                              : `/admin/seats/displaySetupSeat/${room.cinemaRoomId}`
                          }
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            style={{ marginLeft: "5px" }}
                          >
                            {room.roomSizeRow === 0
                              ? "Setup Seat"
                              : "Display Setup Seat"}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No movies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Create/Edit Room Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{editMode ? "Edit Cinema Room" : "Create Cinema Room"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="cinemaRoomName"
                fullWidth
                margin="dense"
                value={newRoom.cinemaRoomName}
                required
                onChange={handleChange}
                error={!!errors.cinemaRoomName}
                helperText={errors.cinemaRoomName}
              />
              <TextField
                label="Seat Quantity"
                name="seatQuantity"
                fullWidth
                margin="dense"
                type="number"
                value={newRoom.seatQuantity}
                required
                onChange={handleChange}
                error={!!errors.seatQuantity}
                helperText={errors.seatQuantity}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {/* Room Detail Dialog */}
          <Dialog
            open={openDetailDialog}
            onClose={() => setOpenDetailDialog(false)}
          >
            <DialogTitle>Room Details</DialogTitle>
            <DialogContent>
              {selectedRoom && (
                <>
                  <TextField
                    label="Row"
                    fullWidth
                    margin="dense"
                    value={selectedRoom.roomSizeRow}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Column"
                    fullWidth
                    margin="dense"
                    value={selectedRoom.roomSizeCol}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Create By"
                    fullWidth
                    margin="dense"
                    value={
                      selectedRoom.createdBy ? selectedRoom.createdBy : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Create At"
                    fullWidth
                    margin="dense"
                    value={
                      selectedRoom.createdAt ? formatDateToDDMMYYYHHMMSS(selectedRoom.createdAt) : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Update By"
                    fullWidth
                    margin="dense"
                    value={
                      selectedRoom.updatedBy ? selectedRoom.updatedBy : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Update At"
                    fullWidth
                    margin="dense"
                    value={
                      selectedRoom.updatedAt ? formatDateToDDMMYYYHHMMSS(selectedRoom.updatedAt) : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDetailDialog(false)}
                color="secondary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CinemaRoomManagement;

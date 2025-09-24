import { Paper, MenuItem, Select, TextField, Button, Box, Typography, Menu, ListItemIcon, ListItemText } from '@mui/material';
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import { toast } from "react-toastify";
import SeatTypeApi from '../../../api/SeatTypeApi';
import CinemaRoomApi from '../../../api/CinemaRoomApi';
import SeatApi from '../../../api/SeatApi';
import { handleApiRequest } from '../../../utils/ApiHandler';
import SeatStatusApi from '../../../api/SeatStatusApi';

const SetupSeat = () => {
    const [rows, setRows] = useState(1);
    const [cols, setCols] = useState(1);
    const [seatMatrix, setSeatMatrix] = useState([]);
    const [seatTypeList, setSeatTypeList] = useState([]);
    const [seatStatusList, setSeatStatusList] = useState([]);
    const [selectedSeatTypeId, setSelectedSeatTypeId] = useState('');
    const [selectedSeatStatusId, setSelectedSeatStatusId] = useState('');
    const { id } = useParams();
    const [cinemaRoom, setCinemaRoom] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        fetchSeatTypeDTO();
        fetchSeatStatusDTO();
        getCinemaRoomById();
    }, [id]);

    // fetch seat type dto
    const fetchSeatTypeDTO = async () => {
        await handleApiRequest({
            apiCall: () => SeatTypeApi.listSeatTypeDto(),
            onSuccess: (res) => {
                setSeatTypeList(res.data);
                setSelectedSeatTypeId(res.data[0].seatTypeId);
            },
            showSuccessToast: false
        })
    };
    // fetch seat status dto
    const fetchSeatStatusDTO = async () => {
        await handleApiRequest({
            apiCall: () => SeatStatusApi.listSeatStatusDto(),
            onSuccess: (res) => {
                setSeatStatusList(res.data);
                console.log(res.data);
                setSelectedSeatStatusId(res.data[0].seatStatusId);
            },
            showSuccessToast: false
        })
    };
    // fetch cinema room
    const getCinemaRoomById = async () => {
        if (!id) return;
        handleApiRequest({
            apiCall: () => CinemaRoomApi.findCinemaRoomById(id),
            onSuccess: (res) => {
                setCinemaRoom(res.data)
            },
            showSuccessToast: false
        })
    };
    // generate a matrix
    const createSeatMatrix = () => {
        if (rows <= 0 || cols <= 0) {
            toast.error("Rows and cols must be greater than 0")
            setRows(1);
            setCols(1);
            return;
        }
        const matrix = Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => ({ row, col, seatTypeId: 1, seatStatusId: 1 }))
        );
        setSeatMatrix(matrix);
    };

    // handle click on seat
    const handleClickOnSeat = (rowIdx, colIdx) => {
        setSeatMatrix(prevMatrix =>
            prevMatrix.map((row, rIndex) =>
                row.map((seat, colIndex) => ({
                    ...seat,
                    seatTypeId:
                        rowIdx === rIndex && colIdx === colIndex
                            ? seat.seatTypeId === selectedSeatTypeId ? 1 : selectedSeatTypeId
                            : seat.seatTypeId,
                    seatStatusId:
                        rowIdx === rIndex && colIdx === colIndex
                            ? seat.seatStatusId === selectedSeatStatusId ? 1 : selectedSeatStatusId
                            : seat.seatStatusId
                }))
            )
        );
    };

    // save setup seats
    const handleSaveSetupSeat = async () => {
        const reqSeatDTO = { rows, cols, seatMatrix }
        console.log(reqSeatDTO)
        handleApiRequest({
            apiCall: () => SeatApi.setupSeats(id, reqSeatDTO),
            onSuccess: () => {
                navigate("/admin/seats/displaySetupSeat/"+id);
            },
            successMessage: "Setup seats successfully!",
            showSuccessToast: true
        })
    }
    return (
        <Box display="flex" width="100vw" height="100vh">
            <Sidebar />
            <Box flex={1} display="flex" flexDirection="column" bgcolor="#f9f9f9">
                <Navbar />
                <Box p={3}>
                    <Typography variant="h5" fontWeight="bold" mb={5} mt={8}>
                        Setup Seat - Room: {cinemaRoom.cinemaRoomName}
                    </Typography>

                    {/* Input và lựa chọn */}
                    <Box display="flex" alignItems="center" gap={3} mb={3}>
                        <TextField label="Rows" type="number" value={rows} onChange={(e) => { setRows(Number(e.target.value)); createSeatMatrix() }}
                            variant="outlined" size="small" sx={{ width: 100 }} />
                        <TextField label="Columns" type="number" value={cols} onChange={(e) => { setCols(Number(e.target.value)), createSeatMatrix() }}
                            variant="outlined" size="small" sx={{ width: 100 }} />
                        <Typography variant="subtitle1">Type:</Typography>
                        <Select
                            value={selectedSeatTypeId}
                            onChange={(e) => setSelectedSeatTypeId(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 200 }}
                        >
                            {seatTypeList?.map((st) => (
                                <MenuItem key={st.seatTypeId} value={st.seatTypeId}>
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            bgcolor: st.seatTypeColour,  // Màu từ thuộc tính seatTypeColour
                                            borderRadius: "50%",
                                            marginRight: 1  // Khoảng cách giữa màu và tên
                                        }}
                                    />
                                    {st.seatTypeName}
                                </MenuItem>
                            ))}
                        </Select>

                        <Typography variant="subtitle1">Status:</Typography>
                        <Select
                            value={selectedSeatStatusId}
                            onChange={(e) => setSelectedSeatStatusId(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 200 }}
                        >
                            {seatStatusList?.map((st) => (
                                <MenuItem key={st.seatStatusId} value={st.seatStatusId}>
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            bgcolor: st.seatStatusColour,  // Màu từ thuộc tính seatStatusColour
                                            borderRadius: "50%",
                                            marginRight: 1  // Khoảng cách giữa màu và tên
                                        }}
                                    />
                                    {st.seatStatusName}
                                </MenuItem>
                            ))}
                        </Select>

                        <Box display="flex" ml="auto">
                            <Button onClick={() => {
                                const choose = window.confirm("Are you sure want to cancel setup?");
                                if (choose) {
                                    navigate("/admin/rooms-management")
                                }
                            }} variant="contained" color="error" sx={{ mr: 2, width: 150 }}>Cancel</Button>
                            <Button onClick={handleSaveSetupSeat} variant="contained" color="success" sx={{ width: 150 }}>Save</Button>
                        </Box>
                    </Box>
                    {/* Hiển thị màn hình */}
                    <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                        <Typography variant="h6" fontWeight="bold" color="gray">
                            SCREEN
                        </Typography>
                        <Box width="60%" height={10} bgcolor="lightgray" borderRadius={5} />
                    </Box>
                    {/* Ma trận ghế */}
                    <Grid container spacing={1} mt={3} flexDirection="column" alignItems="center">
                        {seatMatrix.length > 0 && seatMatrix.map((row, rowIndex) => (
                            <Grid container key={rowIndex} spacing={1} justifyContent="center">
                                {row.map((seat, colIndex) => (
                                    <Grid key={colIndex}>
                                        <Paper
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                fontSize: 12,
                                                border: `2px solid ${seatTypeList.find(st => st.seatTypeId === seat.seatTypeId)?.seatTypeColour || "white"
                                                    }`,
                                                backgroundColor: `${seatStatusList.find(ss => ss.seatStatusId === seat.seatStatusId)?.seatStatusColour || "white"
                                                    }`,
                                                cursor: "pointer",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
                                                }
                                            }}
                                            onClick={() => handleClickOnSeat(rowIndex, colIndex)}
                                        >
                                            {`${seat.row},${seat.col}`}
                                        </Paper>

                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default SetupSeat;

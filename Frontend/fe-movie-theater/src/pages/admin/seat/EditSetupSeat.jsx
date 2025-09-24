import { Box, Button, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import Grid from "@mui/material/Grid2";
import { toast } from 'react-toastify';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SeatApi from '../../../api/SeatApi';
import SeatTypeApi from '../../../api/SeatTypeApi';
import { handleApiRequest } from '../../../utils/ApiHandler';
import SeatStatusApi from '../../../api/SeatStatusApi';
const EditSetupSeat = () => {
    const [seatMatrix, setSeatMatrix] = useState([]);
    const [cinemaRoomDTO, setCinemaRoomDTO] = useState({});
    const [seatTypeList, setSeatTypeList] = useState([]);
    const [seatStatusList, setSeatStatusList] = useState([]);
    const [selectedSeatTypeId, setSelectedSeatTypeId] = useState('');
    const [selectedSeatStatusId, setSelectedSeatStatusId] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (cinemaRoomDTO?.rows && cinemaRoomDTO?.cols) {
            handleCreateMatrix();
        }
        fetchDisplaySetupSeats();
        fetchSeatTypeDTO();
        fetchSeatStatusDTO();
    }, [id]);

    // fetch all seat type dto
    const fetchSeatTypeDTO = async () => {
        await handleApiRequest({
            apiCall: () => SeatTypeApi.listSeatTypeDto(),
            onSuccess: ((res) => {
                setSeatTypeList(res.data);
                setSelectedSeatTypeId(res.data[0].seatTypeId);
            }),
            showSuccessToast: false
        })
    };

    // fetch all seat status dto
    const fetchSeatStatusDTO = async () => {
        await handleApiRequest({
            apiCall: () => SeatStatusApi.listSeatStatusDto(),
            onSuccess: (res) => {
                setSeatStatusList(res.data);
                setSelectedSeatStatusId(res.data[0].seatStatusId);
            },
            showSuccessToast: false
        })
    };

    // Fetch resSeatDto
    const fetchDisplaySetupSeats = async () => {
        await handleApiRequest({
            apiCall: () => SeatApi.displaySetupSeat(id),
            onSuccess: (res) => {
                if (res.data?.seatMatrix?.length) {
                    setSeatMatrix(res.data?.seatMatrix);
                }
                if (res.data?.resCinemaRoomDTO) {
                    setCinemaRoomDTO(res.data?.resCinemaRoomDTO);
                }
            },
            showSuccessToast: false
        });
    };


    // create matrix
    const handleCreateMatrix = async () => {
        if (rows <= 0 || cols <= 0) {
            toast.error("Rows and cols must be greater than 0")
            rows = 1;
            cols = 1;
            return;
        }
        const matrix = [];
        for (let i = 0; i < cinemaRoomDTO.rows; i++) {
            const row = [];
            for (let j = 0; j < cinemaRoomDTO.cols; j++) {
                row.push({
                    row: i,
                    col: j,
                    seatTypeId: 1,
                    seatStatusId: 1
                });
            }
            matrix.push(row);
        }
        setSeatMatrix(matrix);
    };

    // handle click on seat
    const handleClickOnSeat = (rowIdx, colIdx) => {
        console.log(seatMatrix[rowIdx][colIdx])
        setSeatMatrix(prevMatrix =>
            prevMatrix.map((row, rIndex) =>
                row.map((seat, colIndex) => {
                    if (rIndex === rowIdx && colIndex === colIdx) {
                        return {
                            ...seat,
                            resSeatTypeDTO: {
                                ...seat.resSeatTypeDTO,
                                seatTypeId: seat.resSeatTypeDTO.seatTypeId === selectedSeatTypeId ? 1 : selectedSeatTypeId
                            },
                            resSeatStatusDTO: {
                                ...seat.resSeatStatusDTO,
                                seatStatusId: seat.resSeatStatusDTO.seatStatusId === selectedSeatStatusId ? 1 : selectedSeatStatusId
                            }
                        };
                    }
                    return seat;
                })
            )
        );
    };



    // handle save edit setup seat
    const handleEditSetupSeat = async () => {
        const choose = window.confirm("Are you sure want to save setup?");
        if (choose === false) {
            return;
        }
        const rows = cinemaRoomDTO?.roomSizeRow;
        const cols = cinemaRoomDTO?.roomSizeCol;
        const reqSeatDTO = { rows, cols, seatMatrix };
        await handleApiRequest({
            apiCall: () => SeatApi.editSetupSeat(id, reqSeatDTO),
            onSuccess: () => {
                navigate("/admin/seats/displaySetupSeat/" + id);
            },
            successMessage: "Edit setup seats successfully"
        })
    }

    return (
        <Box display="flex" width="100vw" height="100vh">
            <Sidebar />
            <Box flex={1} display="flex" flexDirection="column" bgcolor="#f9f9f9">
                <Navbar />
                <Box p={3}>
                    <Typography variant="h5" fontWeight="bold" mb={5} mt={10}>
                        Setup Seat - Room: {cinemaRoomDTO.cinemaRoomName}
                    </Typography>

                    {/* Input và lựa chọn */}
                    <Box display="flex" alignItems="center" gap={3} mb={3} >
                        {/* <Button variant="contained" color="primary" onClick={createSeatMatrix}>Create Matrix</Button> */}
                        <Typography variant="subtitle1">Select Seat Type:</Typography>
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
                            <Button onClick={handleEditSetupSeat} variant="contained" color="success" sx={{ width: 150 }}>Save</Button>
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
                                                border: `2px solid ${seatTypeList.find(st => st.seatTypeId === seat.resSeatTypeDTO.seatTypeId)?.seatTypeColour || "white"}`,
                                                backgroundColor: `${seatStatusList.find(ss => ss.seatStatusId === seat.resSeatStatusDTO.seatStatusId)?.seatStatusColour || "white"}`,
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
    )
}

export default EditSetupSeat
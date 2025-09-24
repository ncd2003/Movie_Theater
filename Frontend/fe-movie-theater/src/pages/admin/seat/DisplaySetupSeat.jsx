import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid2";
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import SeatApi from '../../../api/SeatApi';
import { handleApiRequest } from '../../../utils/ApiHandler';

const DisplaySetupSeat = () => {
    const [setupSeatData, setSetupSeatData] = useState(null);
    const [cinemaRoomDTO, setCinemaRoomDTO] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        handleApiRequest({
            apiCall: () => SeatApi.displaySetupSeat(id),
            onSuccess: (res) => {
                setSetupSeatData(res.data.seatMatrix);
                setCinemaRoomDTO(res.data.resCinemaRoomDTO);
            },
            showSuccessToast: false
        });
    }, [id]);

    return (
        <Box display="flex" width="100vw" height="100vh">
            <Sidebar />
            <Box flex={1} display="flex" flexDirection="column">
                <Navbar />

                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" px={5} mt={15} mb={10}>
                    <Typography variant="h5" fontWeight="bold">
                        Room: {cinemaRoomDTO.cinemaRoomName}
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button onClick={() => navigate("/admin/rooms-management")} variant="contained" color="primary" sx={{ width: 100 }}>
                            Back
                        </Button>
                        <Button onClick={() => navigate("/admin/seats/editSetupSeat/" + id)} variant="contained" color="success" sx={{ width: 150 }}>
                            Edit Setup Seat
                        </Button>
                    </Box>
                </Box>

                {/* Seat Type and Status Legend */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={5} gap={2}>
                    <Box display="flex" gap={3} flexWrap="wrap">
                        {setupSeatData &&
                            [...new Set(setupSeatData.flat().map(seat => seat.resSeatTypeDTO?.seatTypeId))]
                                .filter(id => id !== 1)
                                .map(id => {
                                    let typeSeat = setupSeatData.flat().find(seat => seat.resSeatTypeDTO?.seatTypeId === id)?.resSeatTypeDTO;
                                    return (
                                        <Box key={`seat-type-${id}`} display="flex" alignItems="center" gap={1}>
                                            <Paper
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 2,
                                                    border: `3px solid ${typeSeat?.seatTypeColour || "#000"}`,
                                                }}
                                            />
                                            <Typography>{typeSeat?.seatTypeName}</Typography>
                                        </Box>
                                    );
                                })
                        }
                    </Box>

                    <Box display="flex" gap={3} flexWrap="wrap">
                        {setupSeatData &&
                            [...new Set(setupSeatData.flat().map(seat => seat.resSeatStatusDTO?.seatStatusId))]
                                .map(id => {
                                    let statusSeat = setupSeatData.flat().find(seat => seat.resSeatStatusDTO?.seatStatusId === id)?.resSeatStatusDTO;
                                    return (
                                        <Box key={`seat-status-${id}`} display="flex" alignItems="center" gap={1}>
                                            <Paper
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 2,
                                                    backgroundColor: statusSeat?.seatStatusColour || "#fff",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                            <Typography>{statusSeat?.seatStatusName}</Typography>
                                        </Box>
                                    );
                                })
                        }
                    </Box>
                </Box>

                {/* Screen Display */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                    <Typography variant="h6" fontWeight="bold" color="gray">
                        SCREEN
                    </Typography>
                    <Box width="60%" height={10} bgcolor="lightgray" borderRadius={5} />
                </Box>

                {/* Seat Matrix Display */}
                <Grid container spacing={1} flexDirection="column">
                    {setupSeatData?.length > 0 && (() => {
                        let currentRowLabel = 0; // Biến lưu trữ chỉ số hàng (A, B, C,...)

                        return setupSeatData.map((row, rowIndex) => {
                            // Kiểm tra xem hàng có ít nhất 1 ghế không phải lối đi không
                            let hasNonAisleSeat = row.some(seat => seat.resSeatTypeDTO?.seatTypeId !== 1);

                            // Nếu có ghế hợp lệ, tăng chữ cái
                            if (hasNonAisleSeat) {
                                currentRowLabel++;
                            }

                            let position = 1; // Reset số ghế trong hàng

                            return (
                                <Grid container key={`row-${rowIndex}`} spacing={1} justifyContent="center">
                                    {row.map((seat, colIndex) => {
                                        let isAisle = seat.resSeatTypeDTO?.seatTypeId === 1; // Kiểm tra lối đi
                                        let seatBorderColor = isAisle ? "transparent" : seat.resSeatTypeDTO?.seatTypeColour;
                                        let seatBackgroundColor = seat.resSeatStatusDTO?.seatStatusColour || "#ffffff";
                                        let label = isAisle ? "" : `${String.fromCharCode(64 + currentRowLabel)}${position}`;
                                        let seatStatus = seat.resSeatStatusDTO?.seatStatusName || "Unknown";
                                        let isSelectable = seat.resSeatStatusDTO?.isSelectable ?? false;

                                        if (!isAisle) {
                                            position++;
                                        }

                                        return (
                                            <Grid key={`seat-${rowIndex}-${colIndex}`}>
                                                <Paper
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 12,
                                                        fontWeight: "bold",
                                                        borderRadius: 2,
                                                        boxShadow: isAisle ? "none" : 2,
                                                        backgroundColor: seatBackgroundColor,
                                                        color: isAisle ? "transparent" : "black",
                                                        visibility: isAisle ? "hidden" : "visible",
                                                        border: `3px solid ${seatBorderColor}`,
                                                        opacity: isSelectable ? 1 : 0.5,
                                                        cursor: isSelectable ? "pointer" : "not-allowed",
                                                        position: "relative"
                                                    }}
                                                    title={seatStatus}
                                                >
                                                    {label}
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            );
                        }
                        );
                    })()}
                </Grid>
            </Box>
        </Box>
    );
};

export default DisplaySetupSeat;

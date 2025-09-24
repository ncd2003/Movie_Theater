import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import Grid from "@mui/material/Grid2";
import { handleApiRequest } from "../../../utils/ApiHandler";
import SeatApi from "../../../api/SeatApi";
import { Box, MenuItem, Paper, Select, Typography } from "@mui/material";
import { toast } from "react-toastify";
import ScheduleSeatApi from "../../../api/ScheduleSeatApi";
import ScheduleApi from "../../../api/ScheduleApi";
import {formatScheduleTime} from "../../../utils/TimeFormatter"
function PersonSeatSelect() {
  const { state: filteredMovie } = useLocation();
  const [setupSeatData, setSetupSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [scheduleDB, setScheduleDB] = useState(null);
  const [quantity, setQuatity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);
  // const [seatDB, setSeatDB] = useState(null);
  const numbers = [0, 1, 2, 3, 4];
  const navigate = useNavigate();
  useEffect(() => {
    if (filteredMovie?.movieId) {
      fetchSeatMatrix();
      fetchSchedule();
      setSelectedSeats([]);
      setTotalPrice(0);
    }
  }, [quantity]);
  // console.log("filteredMovie " + filteredMovie);
  const fetchSeatMatrix = async () => {
    await handleApiRequest({
      apiCall: () => ScheduleSeatApi.displayScheduleSeat(filteredMovie?.roomId, filteredMovie?.movieSchedules[0].scheduleId),
      onSuccess: (res) => setSetupSeatData(res.data.seatMatrix),
      showSuccessToast: false,
    });
  };

  const fetchSchedule = async () => {
    await handleApiRequest({
      apiCall: () => ScheduleApi.getScheduleByScheduleId(filteredMovie?.movieSchedules[0].scheduleId),
      onSuccess: (res) => setScheduleDB(res.data),
      showSuccessToast: false,
    });
  };

  const handleChange = (e) => {
    setQuatity(e.target.value);
  }
  const handleClickOnSeat = async (rowIdx, colIdx, st, ss, label, p) => {
    if (quantity === 0) {
      toast.info("Must choose quantity first!");
      return;
    }
    if (quantity <= selectedSeats.length && !selectedSeats.some(seat => seat.row === rowIdx && seat.col === colIdx)) {
      toast.info("Cannot select more!");
      return;
    }
    let seatDB = null;
    await handleApiRequest({
      apiCall: () => SeatApi.findSeatByRowAndColAndRoomId(filteredMovie?.roomId, parseInt(rowIdx), parseInt(colIdx)),
      onSuccess: (res) => {
        seatDB = res.data;
      },
      showSuccessToast: false
    })

    const seatSelected = { seatId: seatDB?.seatId, row: rowIdx, col: colIdx, seatTypeId: seatDB?.seatType.seatTypeId, seatType: st, seatStatusId: seatDB?.seatStatus.seatStatusId, seatStatus: ss, seatLable: label, price: p };

    if (selectedSeats.some(seat => seat.row === rowIdx && seat.col === colIdx)) {
      // Nếu ghế đã chọn, bỏ chọn và trừ tiền
      setSelectedSeats(prevSeats => prevSeats.filter(s => !(s.row === rowIdx && s.col === colIdx)));
      setTotalPrice(prevTotal => prevTotal - p);
    } else {
      // Nếu chưa chọn, thêm vào và cộng tiền
      setSelectedSeats(prevSeats => [...prevSeats, seatSelected]);
      setTotalPrice(prevTotal => prevTotal + p);
    }
  };
  const handleMoveOnPayment = () => {
    if (!selectedSeats || selectedSeats.length === 0) {
      toast.error("Not found any seats choosed!")
      return;
    }
    if (quantity > selectedSeats.length) {
      toast.info("Please select more seat!")
      return;
    }
    navigate("/payment", { state: { scheduleDB, filteredMovie, selectedSeats } })
  }

  return (
    <div>
      <Header />
      <div className="mx-32">


        {/* Chọn Chỗ */}
        <div className="bg-[#f9f8f3] py-8 px-4 rounded-lg shadow-md">
          <label>Quantity: </label>
          <Select value={quantity} onChange={handleChange}>
            {numbers.map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          {/* Màn hình chiếu */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
            <Typography variant="h6" fontWeight="bold" color="gray">
              SCREEN
            </Typography>
            <Box width="60%" height={10} bgcolor="lightgray" borderRadius={5} />
          </Box>
          {setupSeatData ? (
            <Grid container spacing={1} flexDirection="column" alignItems="center">
              {(() => {
                let currentRowLabel = 0; // Biến lưu trữ chữ cái của hàng (A, B, C, ...)

                return setupSeatData.map((row, rowIndex) => {
                  // Kiểm tra xem hàng có ít nhất một ghế không phải lối đi không
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
                                width: 50,
                                height: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: "bold",
                                borderRadius: 2,
                                boxShadow: isAisle ? "none" : 2,
                                backgroundColor: selectedSeats.some(s => s.row === rowIndex && s.col === colIndex) ? "gray" : seatBackgroundColor,
                                color: isAisle ? "transparent" : "black",
                                visibility: isAisle ? "hidden" : "visible",
                                border: `2px solid ${seatBorderColor}`,
                                opacity: isSelectable ? 1 : 0.5,
                                cursor: isSelectable ? "pointer" : "not-allowed",
                                position: "relative",
                              }}
                              title={seatStatus}
                              onClick={() => {
                                if (isSelectable) {
                                  handleClickOnSeat(rowIndex, colIndex, seat.resSeatTypeDTO.seatTypeName, seatStatus, label, seat.resSeatTypeDTO.seatTypePrice);
                                }
                              }}
                            >
                              {label}
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                });
              })()}
            </Grid>
          ) : (
            <Typography textAlign="center">Loading seat data...</Typography>
          )}

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
        </div>

        {/* Thông tin phim & ghế đã chọn */}
        <div className="bg-slate-700 text-white flex items-center justify-around py-4 rounded-lg mt-6">
          <Link to="/ticketing" className="flex gap-1 items-center text-blue-500">
            <span>⬅</span> Back
          </Link>
          <img
            src={filteredMovie?.image}
            alt="Movie"
            className="w-16 h-24 object-cover rounded"
          />
          <p>{filteredMovie?.movieName}</p>
          <div className="font-semibold text-center">
            <p>{scheduleDB?.showDate?.showDate?.split("-").reverse().join("-")}</p>
            <p>{formatScheduleTime(filteredMovie?.movieSchedules?.[0]?.scheduleTime)}</p>
            <p>{filteredMovie?.roomName}</p>
            <p className="text-green-300">
              Seat: {selectedSeats.map(s => `${s.seatLable} (${s.seatType})`).join(", ")}
            </p>

          </div>
          <p className="font-bold">Total Price: {totalPrice.toLocaleString("vi-VN")} VND</p>
          <button onClick={handleMoveOnPayment} className="flex gap-1 items-center text-blue-500">
            ➡ Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PersonSeatSelect;

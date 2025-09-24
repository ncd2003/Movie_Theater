import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import { Button, Typography, Card, CardContent, CardMedia, Divider, Box, Grid, TextField, FormControlLabel, Checkbox, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, RadioGroup, Radio } from "@mui/material";
import { toast } from "react-toastify";
import { handleApiRequest } from "../../../utils/ApiHandler";
import ScheduleSeatApi from "../../../api/ScheduleSeatApi";
import VNPayApi from "../../../api/VNPayApi";
import { formatScheduleTime } from "../../../utils/TimeFormatter"
import AccountApi from "../../../api/AccountApi";
import PromotionApi from "../../../api/PromotionApi";
import { Table } from "react-bootstrap";

function Payment() {
  const { state } = useLocation();
  const { scheduleDB, selectedSeats, filteredMovie } = state || {};
  const totalPrice = selectedSeats?.reduce((total, seat) => total + seat.price, 0) || 0;
  const [accountInfo, setAccountInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [listPromotions, setListPromotion] = useState([])
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [convertToTicket, setConvertToTicket] = useState("no");
  const navigate = useNavigate();

  const handlePayment = async () => {
    const formattedSeats = selectedSeats.map(seat => ({
      seatName: `${seat.seatLable}: ${seat.seatType}`
    }));

    localStorage.setItem("paymentState", JSON.stringify({
      scheduleDB,
      selectedSeats,
      filteredMovie
    }));

    if (remainPrice <= 5000) {
      toast.warn("Remain price must be bigger than 5.000 VND")
      return;
    }
    const paymentData = {
      totalMoney: Number(remainPrice),
      movieName: filteredMovie?.movieName?.trim() || null,
      roomName: filteredMovie?.roomName?.trim() || null,
      scheduleShow: new Date(scheduleDB?.showDate?.showDate).toLocaleDateString('en-CA'),
      scheduleShowTime: filteredMovie?.movieSchedules?.[0]?.scheduleTime,
      seats: formattedSeats,
      promotions: filteredDataPromotions,
      emailMember: searchValue.length === 0 ? localStorage.getItem("email").trim() : searchValue.trim()
    };
    // console.log(paymentData)

    try {
      // if(searchValue.length === 0 && localStorage.getItem("roleId") !== 3){
      //   toast.error("Only account member can buy!")
      //   return;
      // }
      const response = await VNPayApi.callPayment(paymentData);
      const paymentUrl = response.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Error creating payment");
      }
    } catch (error) {
      alert("An error occurred, please try again!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("roleId") === '1' || localStorage.getItem("roleId") === '2') {
      handleGetAllPromotionByLocalDateTime();
    }
  }, [])

  // Handle search account by email or phone
  const handleSearchMember = async () => {
    await handleApiRequest({
      apiCall: () => AccountApi.fetchAccountMemberByEmailOrPhoneNumber(searchValue),
      onSuccess: (res) => {
        setAccountInfo(res.data)
      },
      showSuccessToast: false
    })
  }

  // Handle get all promotion by localDateTime
  const handleGetAllPromotionByLocalDateTime = async () => {
    await handleApiRequest({
      apiCall: () => PromotionApi.findAllPromotionsByLocalDateTime(),
      onSuccess: (res) => {
        setListPromotion(res.data)
      },
      showSuccessToast: false
    })
  }

  const handleCheckboxChange = (promotion) => {
    setSelectedPromotions((prev) =>
      prev.includes(promotion)
        ? prev.filter((p) => p !== promotion)
        : [...prev, promotion]
    );
  };

  // Gom tong so tien cua tung promotion type
  const totalDiscount = selectedPromotions
    .filter(p => p.promotionType === "DISCOUNT")
    .reduce((sum, p) => sum + ((p.discountLevel / 100) * totalPrice), 0);

  // Số tiền còn lại sau khi discount
  let remainPrice = 0;
  if (convertToTicket === 'no') {
    remainPrice = totalPrice - totalDiscount;
  } else {
    remainPrice = totalPrice - totalDiscount - accountInfo.score;
  }

  // Nhóm promotions để tránh trùng lặp
  const promotionMap = selectedPromotions.reduce((acc, p) => {
    const { promotionType, discountLevel } = p;

    if (!acc[promotionType]) {
      acc[promotionType] = { promotionType, reward: 0 };
    }

    // Gộp tất cả vào `reward`
    if (promotionType === "DISCOUNT") {
      acc[promotionType].reward += (discountLevel / 100) * totalPrice;
    } else if (promotionType === "SCORE") {
      acc[promotionType].reward += (discountLevel / 100) * totalPrice;
    }

    return acc;
  }, {});

  // Nếu chọn "Convert to ticket", tạo mục "POINT" để chứa số điểm user
  if (convertToTicket === "yes") {
    promotionMap["POINT"] = {
      promotionType: "POINT",
      reward: accountInfo?.score || 0
    };
  }

  // Chuyển object thành mảng
  const filteredDataPromotions = Object.values(promotionMap);


  console.log(filteredDataPromotions)
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ maxWidth: 900, mx: "auto", py: 5, px: 3 }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
          <Grid container>
            {/* Movie Poster */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                image={filteredMovie?.image || "https://via.placeholder.com/400"}
                alt="Movie Poster"
                sx={{
                  height: { xs: 250, md: "100%" },
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>

            {/* Booking Details */}
            <Grid item xs={12} md={7}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                  Booking Details
                </Typography>
                <Typography variant="h5" fontWeight="600" color="text.secondary">
                  {filteredMovie?.movieName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  🎬 <strong>Screen Room:</strong> {filteredMovie?.roomName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ⏰ <strong>Time:</strong> {formatScheduleTime(filteredMovie?.movieSchedules?.[0]?.scheduleTime)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  📅 <strong>Show Date:</strong> {scheduleDB?.showDate?.showDate?.split("-").reverse().join("-")}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" color="success.main" fontWeight="bold">
                  Selected Seats:
                </Typography>
                <ul style={{ paddingLeft: 16, marginTop: 5, fontSize: 16, color: "#333" }}>
                  {selectedSeats?.map((s, index) => (
                    <li key={index}>
                      {s.seatLable} - {s.seatType} - {s.price.toLocaleString("vi-VN")} VND
                    </li>
                  ))}
                </ul>

                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mt: 2 }}>
                  💰 Total Price: {remainPrice.toLocaleString("vi-VN")} VND
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                  <Button variant="outlined" color="primary" onClick={() => navigate("/ticketing")}>
                    ⬅ Back
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handlePayment}>
                    Proceed to Payment
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
        {/* Hiển thị bảng Promotion nếu user có role 1 hoặc 2 */}
        {["1", "2"].includes(localStorage.getItem("roleId")) && (
          <Box sx={{ maxWidth: 900, mx: "auto", py: 5, px: 3 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", p: 3 }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                🔍 Search Member
              </Typography>

              {/* Search Box */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                <TextField
                  label="Enter Email or Phone"
                  name="search"
                  variant="outlined"
                  fullWidth
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearchMember}>
                  Search
                </Button>
              </Box>

              {/* Member Info */}
              {accountInfo ? (
                <Card sx={{ mt: 2, p: 3, boxShadow: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    🎫 Member Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1"><strong>👤 Member ID:</strong> {accountInfo.accountId}</Typography>
                      <Typography variant="body1"><strong>🆔 Identity Card:</strong> {accountInfo.identityCard}</Typography>
                      <Typography variant="body1"><strong>📞 Phone Number:</strong> {accountInfo.phoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1"><strong>📝 Full Name:</strong> {accountInfo.fullName}</Typography>
                      <Typography variant="body1"><strong>⚧ Gender:</strong> {accountInfo.gender}</Typography>
                      <Typography variant="body1" color="success.main">
                        <strong>🏆 Score:</strong> {accountInfo.score?.toLocaleString("vi-VN")}
                      </Typography>
                      {accountInfo.score !== 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body1" color="success.main">
                            <strong>Convert to ticket:</strong>
                          </Typography>
                          <RadioGroup
                            row
                            value={convertToTicket}
                            onChange={(e) => setConvertToTicket(e.target.value)}
                          >
                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                          </RadioGroup>
                        </Box>
                      )}

                    </Grid>
                  </Grid>


                  <>
                    <Divider sx={{ my: 2 }} />
                    <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
                      <Table stickyheader='true'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Promotion Type</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listPromotions.map((p) => (
                            <TableRow key={p.promotionId}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedPromotions.includes(p)}
                                  onChange={() => handleCheckboxChange(p)}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  <strong>{p.promotionType}</strong>
                                </Typography>
                              </TableCell>
                              <TableCell>{p.title}</TableCell>
                              <TableCell>
                                {p.promotionType === "GIFT" && <Typography>🎁 Gift</Typography>}
                                {p.promotionType === "DISCOUNT" && (
                                  <Typography>
                                    -{((p.discountLevel / 100) * totalPrice).toLocaleString("vi-VN")} VND
                                  </Typography>
                                )}
                                {p.promotionType === "SCORE" && (
                                  <Typography>
                                    +{((p.discountLevel / 100) * totalPrice).toLocaleString("vi-VN")} Points
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>

                </Card>
              ) : (
                "Not found member"
              )}
            </Card>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
}

export default Payment;
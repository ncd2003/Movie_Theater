import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleSeatApi from "../../api/ScheduleSeatApi";
import { toast } from "react-toastify";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const responseCode = searchParams.get("vnp_ResponseCode");

        if (responseCode === "00") {
            setStatus("success");

            const savedState = localStorage.getItem("paymentState");

            if (savedState) {
                try {
                    const { scheduleDB, selectedSeats, filteredMovie } = JSON.parse(savedState);

                    const reqScheduleSeat = {
                        cinemaRoomId: filteredMovie?.roomId,
                        showDateId: scheduleDB?.showDate?.showDateId,
                        scheduleId: filteredMovie?.movieSchedules?.[0]?.scheduleId,
                        seats: selectedSeats.map(seat => ({
                            seatId: seat.seatId,
                            seatStatusId: seat.seatStatusId,
                        })),
                    };

                    ScheduleSeatApi.addScheduleSeat(reqScheduleSeat)
                        .catch(() => toast.error("Failed to book seats"));

                    localStorage.removeItem("paymentState");
                } catch (error) {
                    console.error("Lỗi khi parse dữ liệu từ localStorage:", error);
                }
            }
        } else {
            setStatus("fail");
        }

        const redirectTimeout = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(redirectTimeout);
    }, [searchParams, navigate]);

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5}>
                {status === "success" ? (
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                        <Typography variant="h4" color="success.main" gutterBottom>
                            Thanh toán thành công!
                        </Typography>
                        <Typography variant="body1">
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Bạn sẽ được chuyển hướng trong giây lát...
                        </Typography>
                    </>
                ) : status === "fail" ? (
                    <>
                        <ErrorIcon color="error" sx={{ fontSize: 80 }} />
                        <Typography variant="h4" color="error.main" gutterBottom>
                            Thanh toán thất bại!
                        </Typography>
                        <Typography variant="body1">
                            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
                        </Typography>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </Box>
        </Container>
    );
};

export default PaymentResult;

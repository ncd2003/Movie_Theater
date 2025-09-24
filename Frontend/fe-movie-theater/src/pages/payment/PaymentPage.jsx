import React, { useState } from "react";
import { Button, TextField, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";

const PaymentPage = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:8080/api/v1/vnpay/create-payment?amount=${encodeURIComponent(amount)}`);

            if (response.status === 200 && response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl; // Chuyển hướng sang VNPay
            } else {
                setError("Không nhận được URL thanh toán. Vui lòng thử lại!");
            }
        } catch (err) {
            console.error("Lỗi chi tiết:", err.response?.data || err.message);
            setError("Lỗi khi tạo thanh toán. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ width: 400, margin: "auto", textAlign: "center", mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Thanh toán VNPay
            </Typography>
            <TextField
                fullWidth
                label="Nhập số tiền (VND)"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={!!error}
                helperText={error}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
                onClick={handlePayment}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Thanh toán"}
            </Button>
        </Box>
    );
};

export default PaymentPage;

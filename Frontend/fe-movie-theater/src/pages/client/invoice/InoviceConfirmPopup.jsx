import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  formatDateToDDMMYYY,
  formatDateToDDMMYYYHHMMSS,
} from "../../../utils/DateFormat";

export default function InoviceConfirmPopup({
  open,
  handleClose,
  invoice,
  onConfirm,
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(invoice.bookingId, invoice);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        🎟️ MOVIE TICKET INVOICE
      </DialogTitle>
      <DialogContent dividers>
        {invoice && (
          <Box
            sx={{
              border: "1px dashed grey",
              p: 3,
              fontFamily: "monospace",
              bgcolor: "#fefefe",
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              {invoice.movieName}
            </Typography>

            <Divider sx={{ mb: 1 }} />

            <Typography>
              <strong>Screen:</strong> {invoice.roomName}
            </Typography>
            <Typography>
              <strong>Showtime:</strong>{" "}
              {formatDateToDDMMYYYHHMMSS(invoice.bookingDate)}
            </Typography>
            <Typography>
              <strong>Schedule Date:</strong>{" "}
              {formatDateToDDMMYYY(invoice.scheduleShow)}
            </Typography>
            <Typography>
              <strong>Seat:</strong> {invoice.seat}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography
              sx={{ color: "green", fontWeight: "bold", fontSize: 16 }}
            >
              Total: {invoice.totalMoney.toLocaleString("vi-VN")} VND
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              sx={{ color: "blue", fontWeight: "bold", mb: 1 }}
            >
              🎫 Member Information
            </Typography>
            <Typography>
              <strong>Member ID:</strong> {invoice.memberId}
            </Typography>
            <Typography>
              <strong>Full Name:</strong> {invoice.fullName}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {invoice.phoneNumber}
            </Typography>
            <Typography>
              <strong>Email:</strong> {invoice.emailMember}
            </Typography>
            <Typography>
              <strong>Score:</strong>{" "}
              {invoice.addScore ? invoice.addScore.toLocaleString("vi-VN") : 0}
            </Typography>
            <Typography>
              <strong>Promotion:</strong>{" "}
              {invoice.promotion ? invoice.promotion : "N/A"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography align="center" sx={{ fontSize: 12, mt: 1 }}>
              --- Thank you for your purchase! ---
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm Print Invoice
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}

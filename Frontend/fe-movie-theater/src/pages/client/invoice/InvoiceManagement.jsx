import { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import InvoiceApi from "../../../api/InvoiceApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import InoviceConfirmPopup from "./InoviceConfirmPopup";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../../components/ui/table";
import {
  formatDateToDDMMYYY,
  formatDateToDDMMYYYHHMMSS,
} from "../../../utils/DateFormat";
export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [confirmedInvoices, setConfirmedInvoices] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  useEffect(() => {
    setFilteredInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    const storedInvoices =
      JSON.parse(localStorage.getItem("confirmedInvoices")) || {};
    setConfirmedInvoices(storedInvoices);
  }, []);

  const fetchAllInvoices = async () => {
    await handleApiRequest({
      apiCall: () => InvoiceApi.getAllInvoice(),
      onSuccess: (res) => {
        setInvoices(res.data);
        setFilteredInvoices(res.data);
      },
      showSuccessToast: false,
    });
  };
  console.log(invoices);
  const handleSearch = () => {
    const searchText = searchValue.trim().toLowerCase();
    if (!searchText) {
      setFilteredInvoices(invoices);
      return;
    }
    const filtered = invoices.filter(
      (invoice) =>
        invoice.phoneNumber?.includes(searchText) ||
        invoice.emailMember?.includes(searchText)
    );
    setFilteredInvoices(filtered);
  };

  const handleOpenPopup = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleConfirmBooking = async (bookingId, invoice) => {
    const success = await InvoiceApi.updateStatusInvoice(bookingId);
    if (success) {
      setConfirmedInvoices((prev) => {
        const updatedInvoices = { ...prev, [bookingId]: true };
        localStorage.setItem(
          "confirmedInvoices",
          JSON.stringify(updatedInvoices)
        );
        return updatedInvoices;
      });

      printInvoice(invoice);
    }
  };

  const printInvoice = (invoice) => {
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
              background: #fff;
            }
            .invoice-container {
              width: 320px;
              margin: auto;
              padding: 20px;
              border: 1px dashed #000;
              background-color: #fff;
            }
            .invoice-header {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 12px;
            }
            .invoice-subheader {
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              margin: 20px 0 10px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .invoice-detail p {
              margin: 4px 0;
              font-size: 13px;
            }
            .total {
              font-size: 16px;
              font-weight: bold;
              color: green;
              text-align: right;
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .thank-you {
              text-align: center;
              font-size: 12px;
              margin-top: 20px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">🎬 TICKET INVOICE</div>
            <div class="invoice-detail">
              <p><strong> Movie:</strong> ${invoice.movieName}</p>
              <p><strong> Screen:</strong> ${invoice.roomName}</p>
              <p><strong> Date:</strong> ${formatDateToDDMMYYYHHMMSS(
                invoice.bookingDate
              )}</p>
              <p><strong> Time:</strong> ${formatDateToDDMMYYY(
                invoice.scheduleShow
              )}</p>
              <p><strong> Seat:</strong> ${invoice.seat}</p>
              <p class="total">💵 Total: ${invoice.totalMoney.toLocaleString(
                "vi-VN"
              )} VND</p>
            </div>
  
            <div class="invoice-subheader">👤 MEMBER INFORMATION</div>
            <div class="invoice-detail">
              <p><strong>ID:</strong> ${invoice.memberId}</p>
              <p><strong>Name:</strong> ${invoice.fullName}</p>
              <p><strong> Phone:</strong> ${invoice.phoneNumber}</p>
              <p><strong> Email:</strong> ${invoice.emailMember}</p>
              <p><strong> Score:</strong> ${invoice.addScore}</p>
              <p><strong> Promotion:</strong> ${
                invoice.promotion ? invoice.promotion : "N/A"
              }</p>
            </div>
  
            <div class="thank-you">--- THANK YOU & ENJOY YOUR MOVIE ---</div>
          </div>
  
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1} display="flex" flexDirection="column" p={2}>
        <Navbar />

        <Box display="flex" justifyContent="flex-end" p={4} mt={4}>
          <TextField
            label="Search phone number or email"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ width: 350, mr: 1 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Booking ID
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Member ID
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Full Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Phone Number
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Movie
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Room Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Time
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Seat
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.bookingId}>
                    <TableCell align="center">{invoice.bookingId}</TableCell>
                    <TableCell align="center">{invoice.memberId}</TableCell>
                    <TableCell align="center">{invoice.fullName}</TableCell>
                    <TableCell align="center">{invoice.phoneNumber}</TableCell>
                    <TableCell align="center">{invoice.emailMember}</TableCell>
                    <TableCell align="center">
                      {invoice.movieName || "N/A"}
                    </TableCell>
                    <TableCell align="center">{invoice.roomName}</TableCell>
                    <TableCell align="center">
                      {formatDateToDDMMYYY(invoice.scheduleShow) || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {invoice.seat || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color={
                          confirmedInvoices[invoice.bookingId]
                            ? "secondary"
                            : "success"
                        }
                        size="small"
                        onClick={() => handleOpenPopup(invoice)}
                        // disabled={confirmedInvoices[invoice.bookingId]}
                      >
                        {confirmedInvoices[invoice.bookingId]
                          ? "Printed"
                          : "Get Ticket"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <InoviceConfirmPopup
        open={openPopup}
        handleClose={handleClosePopup}
        invoice={selectedInvoice}
        onConfirm={handleConfirmBooking}
      />
    </Box>
  );
}

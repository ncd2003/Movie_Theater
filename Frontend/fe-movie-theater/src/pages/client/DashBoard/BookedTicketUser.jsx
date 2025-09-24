import React, { useState, useEffect } from 'react';
import Header from '../../../layouts/Header/Header';
import Footer from '../../../layouts/Footer/Footer';
import { handleApiRequest } from '../../../utils/ApiHandler';
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../../components/ui/table";
import { Link } from 'react-router-dom';
import LeftSideBarUser from './LeftSideBarUser';
import InvoiceApi from '../../../api/InvoiceApi';
import { formatDateToDDMMYYY } from "../../../utils/DateFormat";
import Paper from '@mui/material/Paper';

const BookedTicketUser = () => {
  const [invoices, setInvoices] = useState([]);
  const [confirmedInvoices, setConfirmedInvoices] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoicesByAccount();
    console.log(invoices);
  }, []);

  const fetchInvoicesByAccount = async () => {
    if (localStorage.getItem("accountId")) {
      await handleApiRequest({
        apiCall: () => InvoiceApi.getInvoiceByAccountId(localStorage.getItem("accountId")),
        onSuccess: (res) => {
          setInvoices(res.data);
        },
        showSuccessToast: false,
      });
    }
  };

  const handleOpenPopup = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPopup(true);
  };

  const handleConfirmBooking = async (bookingId) => {
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
    }
  };

  useEffect(() => {
    const storedInvoices =
      JSON.parse(localStorage.getItem("confirmedInvoices")) || {};
    setConfirmedInvoices(storedInvoices);
  }, []);

  return (
    <>
      <Header />
      {/* Viền dưới Header */}
      <div className='bg-[#FDFCF0] '>
        <div className='relative mb-5'>
          <div className='absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]'></div>
        </div>

        <div className='flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]'>
          {/* Left */}
          <LeftSideBarUser />

          {/* Right */}
          <div className='flex-[4] mt-5 ml-[-50px] w-full'>
            <p className='text-xl text-white bg-slate-900 text-center py-[2px] mb-5'>
              BOOKED TICKET
            </p>

            {/* Table display */}
            <div className='px-5'>
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">#</TableCell>
                      <TableCell align="center">Movie Name</TableCell>
                      <TableCell align="center">Booking Date</TableCell>
                      <TableCell align="center">Total Amount</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length > 0 ? (
                      invoices.map((invoice, index) => (
                        <TableRow key={invoice.bookingId}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{invoice.movieName}</TableCell>
                          <TableCell align="center">
                            {invoice.bookingDate
                              ? formatDateToDDMMYYY(invoice.bookingDate)
                              : "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {invoice.totalMoney
                              ? `${invoice.totalMoney?.toLocaleString("vi-VN")} VND`
                              : "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {invoice.status}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookedTicketUser;

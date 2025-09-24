import React, { useState, useEffect } from 'react';
import Header from '../../../layouts/Header/Header';
import Footer from '../../../layouts/Footer/Footer';
import LeftSideBarUser from './LeftSideBarUser';
import { handleApiRequest } from "../../../utils/ApiHandler";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../../components/ui/table";
import Paper from '@mui/material/Paper';
import InvoiceApi from "../../../api/InvoiceApi";
import { formatDateToDDMMYYY } from "../../../utils/DateFormat";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { set } from 'date-fns';

function HistoryUser() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterAddScore, setFilterAddScore] = useState(false);
  const [filterUseScore, setFilterUseScore] = useState(false);

  useEffect(() => {
    fetchInvoicesByAccount();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [fromDate, toDate, filterAddScore, filterUseScore, invoices]);

  const fetchInvoicesByAccount = async () => {

    if(localStorage.getItem("accountId")){

    await handleApiRequest({
      apiCall: () => InvoiceApi.getInvoiceByAccountId(localStorage.getItem("accountId")),
      onSuccess: (res) => {
        setInvoices(res.data);
      },
      showSuccessToast: false,
    });
  }
  };

  const applyFilters = () => {
    let filtered = invoices;

    if (fromDate) {
      filtered = filtered.filter(invoice => invoice.bookingDate && invoice.bookingDate >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(invoice => invoice.bookingDate && invoice.bookingDate <= toDate);
    }
    if (filterAddScore && filterUseScore) {
      filtered = filtered.filter(invoice => invoice.addScore > 0 && invoice.useScore > 0);
    } else if (filterAddScore) {
      filtered = filtered.filter(invoice => invoice.addScore > 0);
    } else if (filterUseScore) {
      filtered = filtered.filter(invoice => invoice.useScore > 0);
    }
    setFilteredInvoices(filtered);
  };

  return (
    <>
      <Header />
      <div className='bg-[#FDFCF0]'>
        <div className='relative mb-5'>
          <div className='absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]'></div>
        </div>

        <div className='flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]'>
          <LeftSideBarUser />
          <div className='flex-[4] mt-5 ml-[-50px] w-full'>
            <p className='text-xl text-white bg-slate-900 text-center py-[2px] mb-5'>HISTORY</p>

            {/* Filters */}
            <div className='flex gap-4 px-5 mb-4'>
              <TextField
                type='date'
                label='From Date'
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <TextField
                type='date'
                label='To Date'
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox checked={filterAddScore} onChange={(e) => setFilterAddScore(e.target.checked)} />}
                label='Add Score'
              />
              <FormControlLabel
                control={<Checkbox checked={filterUseScore} onChange={(e) => setFilterUseScore(e.target.checked)} />}
                label='Use Score'
              />
            </div>

            {/* Score History Table */}
            <div className='px-5'>
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">#</TableCell>
                      <TableCell align="center">Date Created</TableCell>
                      <TableCell align="center">Movie Name</TableCell>
                      <TableCell align="center">Added Score</TableCell>
                      <TableCell align="center">Used Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice, index) => (
                        <TableRow key={invoice.bookingId}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {invoice.bookingDate ? formatDateToDDMMYYY(invoice.bookingDate) : "N/A"}
                          </TableCell>
                          <TableCell align="center">{invoice.movieName}</TableCell>
                          <TableCell align="center">{(invoice.addScore ?? 0).toLocaleString("vi-VN")}</TableCell>
                          <TableCell align="center">{(invoice.useScore ?? 0).toLocaleString("vi-VN")}</TableCell>
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
}

export default HistoryUser;

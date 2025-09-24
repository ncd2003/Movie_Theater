import React, { useState, useEffect } from "react";
import {
  TextField, Button, Typography, IconButton, List, ListItem, ListItemText,
  Container, Grid, Card, CardContent, Box, Select, MenuItem
} from "@mui/material";
import { Add, Delete, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShowDateApi from "../../../api/ShowDateApi";
import MovieApi from "../../../api/MovieApi";
import ScheduleApi from "../../../api/ScheduleApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
import { formatDateForInput } from "../../../utils/TimeFormatter";
import CinemaRoomApi from "../../../api/CinemaRoomApi";

const AddScheduleByRange = () => {
  const location = useLocation();
  const movieId = location.state?.movieId || null;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [cinemaRoomId, setCinemaRoomId] = useState("");
  const [newTime, setNewTime] = useState("");
  const navigate = useNavigate();
  const [movieDuration, setMovieDuration] = useState("");
  const [movieFromDate, setMovieFromDate] = useState(null);
  const [movieToDate, setMovieToDate] = useState(null);
  const [cinemaRooms, setCinemaRooms] = useState([]);

  useEffect(() => {
    if (movieId) {
      handleApiRequest({
        apiCall: () => MovieApi.getMovieById(movieId),
        onSuccess: (movie) => {
          setMovieFromDate(formatDateForInput(movie.data.fromDate));
          setMovieToDate(formatDateForInput(movie.data.toDate));
          setMovieDuration(movie.data.duration);

        },
        showSuccessToast: false,
        errorMessage: "Failed to fetch movie details!",
      });
    }
    fetchCinemaRooms();
  }, [movieId]);

  const fetchCinemaRooms = async () => {
    await handleApiRequest({
      apiCall: () => CinemaRoomApi.listCinemaRoom(),
      onSuccess: (res) => setCinemaRooms(res.data || []),
      showSuccessToast: false,
    });
  };

  const isTimeValid = (newTime) => {
    const newDateTime = new Date(`1970-01-01T${newTime}:00`);
    for (let schedule of scheduleTimes) {
      const existingDateTime = new Date(`1970-01-01T${schedule}:00`);
      const diff = Math.abs(newDateTime - existingDateTime) / (1000 * 60);
      if (diff < movieDuration + 15) {
        return false;
      }
    }
    return true;
  };

  const handleAddTime = () => {
    if (!newTime) {
      toast.error("Please enter a time.");
      return;
    }

    if (scheduleTimes.includes(newTime)) {
      toast.error("This schedule time already exists!");
      return;
    }

    if (!isTimeValid(newTime)) {
      toast.error(`Time conflict! Minimum gap should be ${movieDuration + 15} minutes.`);
      return;
    }

    setScheduleTimes([...scheduleTimes, newTime]);
    setNewTime("");
  };

  const handleRemoveTime = (time) => {
    setScheduleTimes(scheduleTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    if (!movieId) {
      toast.error("Movie ID is missing!");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Start date and end date are required!");
      return;
    }
    if (scheduleTimes.length === 0) {
      toast.error("Please add at least one schedule time!");
      return;
    }

    if (movieFromDate && startDate < movieFromDate) {
      toast.error(`Start date must be on or after ${movieFromDate}`);
      return;
    }
    if (movieToDate && endDate > movieToDate) {
      toast.error(`End date must be on or before ${movieToDate}`);
      return;
    }

    if (!cinemaRoomId) {
      toast.error("Cinema Room is required!");
      return;
    }



    const confirmAction = window.confirm(
      `This action will remove all old schedules and selected room from ${startDate} to ${endDate}. Are you sure you want to continue?`
    );
    if (!confirmAction) return;

    await handleApiRequest({
      apiCall: () => ShowDateApi.addShowDatesByRange({
        movieId,
        startDate,
        endDate,
        roomId: cinemaRoomId,
        scheduleTimes,
      }),
      onSuccess: () => {
        toast.success("Show dates and schedules added successfully!");
        navigate('/admin/movies/schedule-management', { state: { movieId: movieId } });
      },
      showSuccessToast: false,
      errorMessage: "Failed to add show dates and schedules!",
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" color="primary" startIcon={<ArrowBack />} onClick={() => navigate('/admin/movies/schedule-management', { state: { movieId: movieId } })}>
          Back
        </Button>

      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="h4">Add Schedules By Range</Typography>
      </Box>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Grid item xs={12}>
        <Select fullWidth value={cinemaRoomId} onChange={(e) => setCinemaRoomId(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Select a cinema room</MenuItem>
          {cinemaRooms.map((room) => (
            <MenuItem key={room.cinemaRoomId} value={room.cinemaRoomId}>{room.cinemaRoomName}</MenuItem>
          ))}
        </Select>
      </Grid>

      <Typography variant="h6">Schedule Times:</Typography>

      <TextField
        label="Add Schedule Time"
        type="time"
        value={newTime}
        onChange={(e) => setNewTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />

      <Button onClick={handleAddTime} variant="contained" color="primary" startIcon={<Add />} sx={{ mb: 2 }}>
        Add Time
      </Button>

      <Grid container spacing={2}>
        {scheduleTimes.map((time, index) => (
          <Grid item xs={2} key={index}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{time}</Typography>
                <IconButton onClick={() => handleRemoveTime(time)}>
                  <Delete color="error" />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button onClick={handleSubmit} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </Container>
  );
};

export default AddScheduleByRange;

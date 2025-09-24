import React, { useState, useEffect } from "react";
import {
    TextField, Button, Typography, IconButton, List, ListItem, ListItemText,
    Container, Grid, Card, CardContent, Box, Pagination, Select, MenuItem
} from "@mui/material";
import { Add, Delete, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShowDateApi from "../../../api/ShowDateApi";
import ScheduleApi from "../../../api/ScheduleApi";
import MovieApi from "../../../api/MovieApi";
import CinemaRoomAPI from "../../../api/CinemaRoomApi";
import { formatScheduleTime } from "../../../utils/TimeFormatter";
import { handleApiRequest } from "../../../utils/ApiHandler";

const ScheduleManagement = () => {
    const location = useLocation();
    const movieId = location.state?.movieId || null;
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateId, setShowDateId] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [movieDuration, setMovieDuration] = useState(0);
    const [newTime, setNewTime] = useState("");
    const [page, setPage] = useState(1);
    const [cinemaRooms, setCinemaRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const datesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (!movieId) return;

        handleApiRequest({
            apiCall: () => MovieApi.getMovieById(movieId),
            onSuccess: (movie) => {
                const startDate = new Date(movie.data.fromDate);
                const endDate = new Date(movie.data.toDate);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    toast.error("Invalid date format received!");
                    return;
                }
                setDates(getDatesInRange(startDate, endDate));
                setMovieDuration(movie.data.duration);
            },
            showSuccessToast: false,
            errorMessage: "Failed to load movie dates",
        });
    }, [movieId]);

    useEffect(() => {
        handleApiRequest({
            apiCall: () => CinemaRoomAPI.listCinemaRoom(),
            onSuccess: (data) => setCinemaRooms(data.data),
            errorMessage: "Failed to load cinema rooms",
            showSuccessToast: false,
        });
    }, []);


    const getDatesInRange = (start, end) => {
        const dateArray = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    };


    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowDateId(null);
        setSchedules([]);
        setSelectedRoom("");

        handleApiRequest({
            apiCall: () => ShowDateApi.getShowDatesByMovieId(movieId),
            onSuccess: (showDates) => {
                const existingShowDate = showDates.data.find(sd =>
                    new Date(sd.showDate).toDateString() === date.toDateString()
                );

                if (existingShowDate) {
                    setShowDateId(existingShowDate.showDateId);

                    handleApiRequest({
                        apiCall: () => ScheduleApi.getSchedulesByShowDate(existingShowDate.showDateId),
                        onSuccess: (schedules) => {
                            setSchedules(schedules.data.map(s => ({ ...s, scheduleTime: formatScheduleTime(s.scheduleTime) })));
                            setSelectedRoom(existingShowDate.cinemaRoomId || "");
                        },
                        errorMessage: "Failed to load schedules",
                        showSuccessToast: false,
                    });
                }
            },
            showSuccessToast: false,
            errorMessage: "Failed to load show dates",
        });
    };


    const isTimeValid = (newTime) => {
        const newDateTime = new Date(`1970-01-01T${newTime}:00`);
        for (let schedule of schedules) {
            const existingDateTime = new Date(`1970-01-01T${schedule.scheduleTime}:00`);
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

        if (schedules.some(s => s.scheduleTime === newTime)) {
            toast.error("This schedule time already exists!");
            return;
        }

        if (!isTimeValid(newTime)) {
            toast.error(`Time conflict! Minimum gap should be ${movieDuration + 15} minutes.`);
            return;
        }

        setSchedules([...schedules, { scheduleTime: newTime }]);
        setNewTime("");
    };

    const handleRemoveTime = (time) => {
        setSchedules(schedules.filter((s) => s.scheduleTime !== time));
    };

    const handleRoomChange = (event) => {
        const roomId = event.target.value;
        setSelectedRoom(roomId);
    };

    const handleSaveSchedules = () => {

        if (schedules.length === 0 && showDateId) {
            // If all times are removed and there was a showDateId, delete schedules
            handleApiRequest({
                apiCall: () => ScheduleApi.deleteAllSchedulesByShowDate(showDateId),
                onSuccess: () => {
                    toast.success("All schedules deleted successfully!");
                    setSchedules([]);
                    handleDateClick(selectedDate);
                },
                onError: () => handleDateClick(selectedDate),
                errorMessage: "Failed to delete schedules",
                showSuccessToast: false,
            });
            return;
        }

        if (!selectedDate || schedules.length === 0 || !selectedRoom) {
            toast.error("Please select a date, a cinema room, and add schedule times before saving.");
            return;
        }


        if (!showDateId) {
            handleApiRequest({
                apiCall: () => ShowDateApi.addShowDate({
                    movieId: movieId,
                    date: selectedDate.toISOString().split("T")[0],
                }),
                onSuccess: (newShowDate) => {
                    setShowDateId(newShowDate.data.showDateId);

                    // Assign the selected cinema room to the show date
                    handleApiRequest({
                        apiCall: () => ShowDateApi.addRoomToShowDate({
                            showDateId: newShowDate.data.showDateId,
                            roomId: selectedRoom
                        }),
                        onSuccess: () => saveSchedules(newShowDate.data.showDateId),
                        errorMessage: "Failed to assign cinema room to the show date",
                        showSuccessToast: false,
                    });
                },
                showSuccessToast: false,
                errorMessage: "Failed to add new show date",
            });

        } else {
            handleApiRequest({
                apiCall: () => ShowDateApi.addRoomToShowDate({ showDateId: showDateId, roomId: selectedRoom }),
                onSuccess: () => saveSchedules(showDateId),
                showSuccessToast: false,
            });
        }
    };


    const saveSchedules = (showDateId) => {
        handleApiRequest({
            apiCall: () => ScheduleApi.addSchedule({
                showDateId: showDateId,
                scheduleTimes: schedules.map(s => s.scheduleTime),
            }),
            onSuccess: () => toast.success("Schedules updated successfully!"),
            errorMessage: "Failed to update schedules",
            showSuccessToast: false,
            onError: () => handleDateClick(selectedDate),
        });

    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<ArrowBack />} onClick={() => navigate('/admin/movies/movie-management')}>
                    Back
                </Button>
                <Typography variant="h4">View & Edit Schedules</Typography>
                <Button variant="contained" color="success" onClick={() => navigate('/admin/movies/add-by-range', { state: { movieId } })}>
                    Add By Range
                </Button>
            </Box>


            <Grid container spacing={2} justifyContent="center">
                {dates.slice((page - 1) * datesPerPage, page * datesPerPage).map((date, index) => (
                    <Grid item key={index}>
                        <Button
                            variant="contained"
                            onClick={() => handleDateClick(date)}
                            sx={{ backgroundColor: "white", color: "black", "&:hover": { backgroundColor: "#f0f0f0" } }}
                        >
                            {date.toLocaleDateString("en-GB", { weekday: "short" })} {date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </Button>
                    </Grid>
                ))}
            </Grid>


            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={Math.ceil(dates.length / datesPerPage)} page={page} onChange={(_, value) => setPage(value)} />
            </Box>

            {selectedDate && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <Typography variant="h6">Schedules for {selectedDate.toDateString()}</Typography>
                    <Grid container spacing={2}>
                        {schedules.map((schedule, index) => (
                            <Grid item xs={2} key={index}>
                                <Card>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>{schedule.scheduleTime}</Typography>
                                        <IconButton onClick={() => handleRemoveTime(schedule.scheduleTime)}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 2 }}>Add Schedule Time</Typography>
                    <TextField type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} fullWidth margin="normal" />
                    <Button onClick={handleAddTime} variant="contained" color="primary" startIcon={<Add />}>Add Time</Button>
                    <Grid item xs={12}>
                        <Select fullWidth value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} displayEmpty>
                            <MenuItem value="" disabled>Select a cinema room</MenuItem>
                            {cinemaRooms.map((room) => (
                                <MenuItem key={room.cinemaRoomId} value={room.cinemaRoomId}>{room.cinemaRoomName}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Button onClick={handleSaveSchedules} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>Save Schedules</Button>
                </Card>
            )}
        </Container>
    );
};

export default ScheduleManagement;

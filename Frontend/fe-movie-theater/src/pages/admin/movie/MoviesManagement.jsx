import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Paper, Button, TextField, Dialog, DialogTitle,DialogContent,DialogActions } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MovieApi from "../../../api/MovieApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
import { toast } from "react-toastify";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../../../components/ui/table";
import Access from '../../../utils/Access'
import { formatDateToDDMMYYY } from "../../../utils/DateFormat";
const MoviesManagement = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  //get all movie when access
  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    await handleApiRequest({
      apiCall: () => MovieApi.getAllMoviesAdmin(),
      onSuccess: (res) => {
        setMovies(res.data);

      },
      showSuccessToast: false,
    });

  };

  //redirect to create movie page
  const handleOpenCreate = () => {
    navigate("/admin/movies/create-movie");
  };

  const handleViewSchedule = (movieId) => {
    navigate("/admin/movies/schedule-management", { state: { movieId: movieId } });
  };

  const handleEditMovie = (movieId) => {
    navigate("/admin/movies/update-movie", { state: { movieId: movieId } });
  };

  const handleDeleteMovie = async (movieId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;

    await handleApiRequest({
      apiCall: () => MovieApi.deleteMovie(movieId),
      onSuccess: () => {
        toast.success("Movie deleted successfully!");
        fetchAllMovies(); // Refresh the movie list after deletion
      },
      errorMessage: "Failed to delete movie!",
    });
  };



  // Filter movies based on search input
  const filteredMovies = movies.filter((movie) =>
    movie?.movieName.toLowerCase().includes(search?.toLowerCase())
  );

  const handleOpenDetailDialog = (movie) => {
    setSelectedMovie(movie);
    setOpenDetailDialog(true);
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "70px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Search by name..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Access permission={{ method: "POST", apiPath: "/api/v1/movies", module: "Movie" }} hideChildren>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenCreate}
            >
              Create Movie
            </Button>
            </Access>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Movie Name</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Movie Production Company</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie) => (
                    <TableRow key={movie.movieId}>
                      <TableCell>{movie.movieName}</TableCell>
                      <TableCell>{formatDateToDDMMYYY(movie.fromDate)}</TableCell>
                      <TableCell>{movie.movieProductionCompany}</TableCell>
                      <TableCell>{movie.duration} min</TableCell>
                      <TableCell>{movie.version}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleOpenDetailDialog(movie)}
                        >
                          Detail
                        </Button>
                        <Access permission={{ method: "POST", apiPath: "/api/v1/schedules/add", module: "Schedule" }} hideChildren>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleViewSchedule(movie.movieId)}
                        >
                          Schedule
                        </Button>
                        </Access>
                        <Access permission={{ method: "PUT", apiPath: "/api/v1/movies/{id}", module: "Movie" }} hideChildren>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleEditMovie(movie.movieId)}
                        >
                          Edit
                        </Button>
                        </Access>
                        <Access permission={{ method: "DELETE", apiPath: "/api/v1/movies/{id}", module: "Movie" }} hideChildren>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleDeleteMovie(movie.movieId)}
                        >
                          Delete
                        </Button>
                        </Access>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No movies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            open={openDetailDialog}
            onClose={() => setOpenDetailDialog(false)}
          >
            <DialogTitle>Movie Details</DialogTitle>
            <DialogContent>
              {selectedMovie && (
                <>
                  <TextField
                    label="Movie Name"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.movieName}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Director"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.director || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Created By"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.createdBy || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Created At"
                    fullWidth
                    margin="dense"
                    value={
                      selectedMovie.createdAt
                        ? formatDateToDDMMYYY(selectedMovie.createdAt)
                        : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Updated By"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.updatedBy || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Updated At"
                    fullWidth
                    margin="dense"
                    value={
                      selectedMovie.updatedAt
                        ? formatDateToDDMMYYY(selectedMovie.updatedAt)
                        : "N/A"
                    }
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Movie Production Company"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.movieProductionCompany || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Version"
                    fullWidth
                    margin="dense"
                    value={selectedMovie.version || "N/A"}
                    InputProps={{ readOnly: true }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDetailDialog(false)}
                color="secondary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MoviesManagement;

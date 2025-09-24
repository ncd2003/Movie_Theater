import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  Select,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import MovieApi from "../../../api/MovieApi";
import MovieTypeApi from "../../../api/MovieTypeApi";
import CinemaRoomApi from "../../../api/CinemaRoomApi";
import FileAPI from "../../../api/FileApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateForInput } from "../../../utils/TimeFormatter";

const UpdateMovie = () => {
  const location = useLocation();
  const movieId = location.state?.movieId || null;
  const [movie, setMovie] = useState(null);
  const [movieTypes, setMovieTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieTypes();
  }, []);

  const fetchMovieDetails = async () => {
    await handleApiRequest({
      apiCall: () => MovieApi.getMovieById(movieId),
      onSuccess: async (res) => {
        const movieData = res.data;
        setOldImage(movieData.image);

        await handleApiRequest({
          apiCall: () => MovieTypeApi.getTypesByMovieId(movieId),
          onSuccess: (typeRes) => {
            setMovie({
              ...movieData,
              fromDate: formatDateForInput(movieData.fromDate),
              toDate: formatDateForInput(movieData.toDate),
              types: typeRes.data.map((type) => type.typeId) || [],
            });
          },
          showSuccessToast: false,
          errorMessage: "Failed to fetch movie types.",
        });

        setImagePreview(movieData.image);
      },
      errorMessage: "Failed to fetch movie details.",
      showSuccessToast: false,
    });
  };

  const fetchMovieTypes = async () => {
    await handleApiRequest({
      apiCall: () => MovieTypeApi.getAllTypes(),
      onSuccess: (res) => setMovieTypes(res.data || []),
      showSuccessToast: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMovie((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (typeId) => {
    setMovie((prev) => {
      const updatedTypes = prev.types.includes(typeId)
        ? prev.types.filter((id) => id !== typeId)
        : [...prev.types, typeId];
      return { ...prev, types: updatedTypes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movie.movieName.trim()) {
      toast.error("Movie name is required!");
      return;
    }
    const formData = new FormData();
    Object.keys(movie).forEach((key) => {
      if (key !== "types" && key !== "image") {
        formData.append(key, movie[key]);
      }
    });

    await handleApiRequest({
      apiCall: () => MovieApi.updateMovie(movieId, formData),
      onSuccess: async () => {
        if (movie.types.length > 0) {
          await handleApiRequest({
            apiCall: () => MovieApi.addTypesToMovie(movieId, movie.types),
            showSuccessToast: false,
            errorMessage: "Failed to update types.",
          });
        }

        if (movie.image instanceof File && oldImage) {
          await handleApiRequest({
            apiCall: () => FileAPI.deleteFile(oldImage),
            showSuccessToast: false,
            errorMessage: "Failed to delete old image.",
          });
        }

        if (movie.image instanceof File) {
          const formDataImage = new FormData();
          formDataImage.append("file", movie.image);
          formDataImage.append("folder", "movies");

          await handleApiRequest({
            apiCall: () => FileAPI.uploadFile(formDataImage),
            onSuccess: async (res) => {
              const imageUrl = res;
              await handleApiRequest({
                apiCall: () => MovieApi.addImageToMovie(movieId, imageUrl),
                showSuccessToast: false,
                errorMessage: "Failed to update image.",
              });
            },
            showSuccessToast: false,
            errorMessage: "Failed to upload image.",
          });
        }
        toast.success("Movie updated successfully!");
        navigate("/admin/movies/movie-management");
      },
      showSuccessToast: false,
      errorMessage: "Failed to update movie.",
    });
  };

  if (!movie) return <Typography>Loading movie details...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Update Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Movie Name"
                name="movieName"
                value={movie.movieName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Actor"
                name="actor"
                value={movie.actor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Director"
                name="director"
                value={movie.director}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Production Company"
                name="movieProductionCompany"
                value={movie.movieProductionCompany}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={movie.content}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={movie.duration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Version"
                name="version"
                value={movie.version}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From Date"
                name="fromDate"
                type="date"
                value={movie.fromDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To Date"
                name="toDate"
                type="date"
                value={movie.toDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trailer"
                name="trailer"
                value={movie.trailer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Movie Types:</Typography>
              {movieTypes.map((type) => (
                <FormControlLabel
                  key={type.typeId}
                  control={
                    <Checkbox
                      checked={movie.types.includes(type.typeId)}
                      onChange={() => handleCheckboxChange(type.typeId)}
                    />
                  }
                  label={type.typeName}
                />
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Upload Image:</Typography>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* Show current image if available */}
              {(imagePreview || movie.image) && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2">Image Preview:</Typography>
                  <img
                    src={
                      imagePreview ||
                      (typeof movie.image === "string"
                        ? movie.image
                        : URL.createObjectURL(movie.image))
                    }
                    alt="Movie Preview"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      marginTop: 10,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Update Movie
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateMovie;

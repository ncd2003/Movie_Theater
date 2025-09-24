import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import MovieApi from '../../../api/MovieApi';
import MovieTypeApi from '../../../api/MovieTypeApi';
import CinemaRoomApi from '../../../api/CinemaRoomApi';
import FileAPI from '../../../api/FileApi';
import { handleApiRequest } from '../../../utils/ApiHandler';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateMovie = () => {
  const [movie, setMovie] = useState({
    movieName: '',
    actor: '',
    director: '',
    content: '',
    duration: '',
    fromDate: '',
    toDate: '',
    movieProductionCompany: '',
    version: '',
    trailer: '',
    image: null,
    types: [],
  });

  const [movieTypes, setMovieTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieTypes();
  }, []);

  const fetchMovieTypes = async () => {
    await handleApiRequest({
      apiCall: () => MovieTypeApi.getAllTypes(),
      onSuccess: (res) => setMovieTypes(res.data || []),
      showSuccessToast: false,
    });
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Change youtube link to embed
    if (name === 'trailer') {
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
      const match = value.match(youtubeRegex);

      if (match) {
        newValue = `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    setMovie((prev) => ({ ...prev, [name]: newValue }));
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMovie((prev) => ({ ...prev, image: file }));

    // Show image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
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

    // Required fields validation
    const requiredFields = [
      'movieName',
      'actor',
      'director',
      'content',
      'duration',
      'fromDate',
      'toDate',
      'movieProductionCompany',
      'version',
      'trailer',
      'image',
    ];

    for (const field of requiredFields) {
      if (!movie[field] || movie[field].toString().trim() === '') {
        toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required!`);
        return;
      }
    }

    if (isNaN(movie.duration) || movie.duration <= 0) {
      toast.error('Duration must be a positive number!');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fromDate = new Date(movie.fromDate);
    const toDate = new Date(movie.toDate);

    if (fromDate < today) {
      toast.error('From Date must be today or later!');
      return;
    }

    if (fromDate >= toDate) {
      toast.error('From Date must be earlier than To Date!');
      return;
    }

    // Create movie first (without image)
    const formData = new FormData();
    Object.keys(movie).forEach((key) => {
      if (key !== 'types' && key !== 'image') {
        formData.append(key, movie[key]);
      }
    });

    await handleApiRequest({
      apiCall: () => MovieApi.createMovie(formData),
      showSuccessToast: false,
      onSuccess: async (res) => {
        const movieId = res.data.movieId;

        // Add types if selected
        if (movie.types.length > 0) {
          await handleApiRequest({
            apiCall: () => MovieApi.addTypesToMovie(movieId, movie.types),
            showSuccessToast: false,
            errorMessage: 'Failed to add types.',
          });
        }

        // Upload image after movie creation
        const formDataImage = new FormData();
        formDataImage.append('file', movie.image);
        formDataImage.append('folder', 'movies');

        await handleApiRequest({
          apiCall: () => FileAPI.uploadFile(formDataImage),
          onSuccess: async (res) => {
            const imageUrl = res;

            // Add image URL to movie
            await handleApiRequest({
              apiCall: () => MovieApi.addImageToMovie(movieId, imageUrl),
              showSuccessToast: false,
              errorMessage: 'Failed to add image to movie.',
            });
          },
          showSuccessToast: false,
          errorMessage: 'Failed to upload image.',
        });

        toast.success('Movie created successfully!');
        navigate('/admin/movies/movie-management');
      },
      errorMessage: 'Failed to create movie.',
    });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'white' }}>
        <Typography variant='h4' align='center' gutterBottom>
          Create Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Movie Name'
                name='movieName'
                value={movie.movieName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Actor'
                name='actor'
                value={movie.actor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Director'
                name='director'
                value={movie.director}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Production Company'
                name='movieProductionCompany'
                value={movie.movieProductionCompany}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Content'
                name='content'
                value={movie.content}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Duration (minutes)'
                name='duration'
                type='number'
                value={movie.duration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Version'
                name='version'
                value={movie.version}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='From Date'
                name='fromDate'
                type='date'
                value={movie.fromDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='To Date'
                name='toDate'
                type='date'
                value={movie.toDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Trailer'
                name='trailer'
                value={movie.trailer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>Movie Types:</Typography>
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
              <Typography variant='subtitle1'>Upload Image:</Typography>
              <input type='file' accept='image/*' onChange={handleFileChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Preview'
                  style={{ marginTop: 10, width: '100%', maxHeight: '100%' }}
                />
              )}
            </Grid>
          </Grid>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Movie
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateMovie;

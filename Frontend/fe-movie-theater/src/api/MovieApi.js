import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi";

class MovieAPI {
    constructor() {
        this.url = "/movies"; 
    }

    getAllMovies = () => authorApi.get(`${this.url}/client`);

    getMovieById = (id) => unAuthorApi.get(`${this.url}/client/${id}`);

    searchMovieByName = (keyword) => authorApi.get(`${this.url}/search`, { params: { keyword } });

    createMovie = (movieData) => authorApi.post(`${this.url}`, movieData);

    updateMovie = (id, movieData) => authorApi.put(`${this.url}/${id}`, movieData);

    deleteMovie = (id) => authorApi.delete(`${this.url}/${id}`);

    addTypesToMovie = (movieId, typeIds) => authorApi.post(`${this.url}/${movieId}/types`, typeIds);

    getMoviesByDate = (date) => unAuthorApi.get(`${this.url}/client/by-date?date=${date}`);

    addImageToMovie = (movieId, imgLink) => authorApi.post(`${this.url}/${movieId}/image`, { imageUrl: imgLink });

    getAllMoviesAdmin = () => authorApi.get(`${this.url}`);


}

export default new MovieAPI();

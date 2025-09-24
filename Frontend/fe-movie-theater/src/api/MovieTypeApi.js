import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi";

class MovieTypeAPI {
    constructor() {
        this.url = "/type";
    }
    getAllTypes = () => authorApi.get(`${this.url}`);

    getTypeById = (id) => authorApi.get(`${this.url}/${id}`);

    getTypesByMovieId = (movieId) => unAuthorApi.get(`${this.url}/client/movie/${movieId}`);

}
export default new MovieTypeAPI();

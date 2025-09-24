import authorApi from "./baseAPI/AuthorBaseApi";

class ShowDateApi {
    constructor() {
        this.url = "/show-dates";
    }

    addShowDate = (data) => authorApi.post(`${this.url}`, data);

    addShowDatesByRange = (data) => authorApi.post(`${this.url}/range`, data);

    getShowDatesByMovieId = (movieId) => authorApi.get(`${this.url}/movie/${movieId}`);

    addRoomToShowDate = (data) => authorApi.put(`${this.url}/room`, data);
}

export default new ShowDateApi();

import authorApi from "./baseAPI/AuthorBaseApi";

class ScheduleApi {
    constructor() {
        this.url = "/schedules";
    }

    addSchedule = (data) => authorApi.post(`${this.url}/add`, data);

    addSchedulesByRange = (data) => authorApi.post(`${this.url}/add-range`, data);

    getSchedulesByShowDate = (showDateId) => authorApi.get(`${this.url}/show-date/${showDateId}`);

    deleteSchedulesByRange = (data) => authorApi.delete(`${this.url}/delete-range`, { data });

    getSchedulesByDateAndMovie = (movieId, date) => authorApi.get(`${this.url}/movie-date`, { params: { movieId, date } });

    getScheduleByScheduleId = (scheduleId) => authorApi.get(`${this.url}`, { params: { scheduleId } });

    deleteAllSchedulesByShowDate = (showDateId) => authorApi.delete(`${this.url}/show-date/${showDateId}`);

}

export default new ScheduleApi();

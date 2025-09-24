import authorApi from "./baseAPI/AuthorBaseApi";

class ScheduleSeatAPI {
    constructor() {
        this.url = "/seat-schedule";
    }

    displayScheduleSeat = (cinemaRoomId, reqScheduleId) => authorApi.get(`${this.url}/${cinemaRoomId}?reqScheduleId=${reqScheduleId}`);

    addScheduleSeat = (reqScheduleSeat) => authorApi.post(`${this.url}`,reqScheduleSeat);

}
export default new ScheduleSeatAPI();
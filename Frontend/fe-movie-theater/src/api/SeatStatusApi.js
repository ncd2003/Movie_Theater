import authorApi from "./baseAPI/AuthorBaseApi";
class SeatStatusAPI {
    constructor() {
        this.url = "/seat-status"
    }
    listSeatStatusDto = () => authorApi.get(`${this.url}/seatStatusDto`);

    getListSeatStatus = () => authorApi.get(`${this.url}`);

    createSeatStatus = (seatStatus) => authorApi.post(`${this.url}`, seatStatus);

    updateSeatStatus = (id, seatStatus) => authorApi.put(`${this.url}/${id}`, seatStatus);

    deleteSeatStatus = (id) => authorApi.delete(`${this.url}/${id}`)
}
export default new SeatStatusAPI();
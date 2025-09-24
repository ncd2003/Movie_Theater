import authorApi from "./baseAPI/AuthorBaseApi";
class SeatTypeAPI {
    constructor() {
        this.url = "/seat-type"
    }
    listSeatTypeDto = () => authorApi.get(`${this.url}/seatTypeDto`);

    listSeatType = () => authorApi.get(`${this.url}`);

    createSeatType = (seatType) => authorApi.post(`${this.url}`, seatType);

    updateSeatType = (id, seatType) => authorApi.put(`${this.url}/${id}`, seatType);

    deleteSeatType = (id) => authorApi.delete(`${this.url}/${id}`)
}
export default new SeatTypeAPI();
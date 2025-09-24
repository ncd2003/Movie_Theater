import authorApi from "./baseAPI/AuthorBaseApi";

class SeatAPI {
    constructor() {
        this.url = "/seat";
    }
    setupSeats = (id, reqSeatDTO) => authorApi.post(`${this.url}/${id}`, reqSeatDTO);

    displaySetupSeat = (cinemaRoomId) => authorApi.get(`${this.url}/${cinemaRoomId}`);

    editSetupSeat = (id, reqSeatDTO) => authorApi.put(`${this.url}/${id}`, reqSeatDTO);

    findSeatByRowAndColAndRoomId = (roomId,row, col) => authorApi.get(`${this.url}/findByRowColRoomId/${roomId}?row=${row}&col=${col}`)
}
export default new SeatAPI();
import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi";

class CinemaRoomAPI {
    constructor() {
        this.url = "/cinema-room";
    }
    listCinemaRoom = () => authorApi.get(`${this.url}`);

    createANewRoom = (room) => authorApi.post(`${this.url}`, room)

    updateCinemaRoom = (id, room) => authorApi.put(`${this.url}/${id}`, room)

    deleteCinemaRoom = (id) => authorApi.delete(`${this.url}/${id}`)

    findCinemaRoomById = (id) => authorApi.get(`${this.url}/${id}`);
}
export default new CinemaRoomAPI();
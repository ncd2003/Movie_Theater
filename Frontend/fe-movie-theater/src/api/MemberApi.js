import authorApi from "./baseAPI/AuthorBaseApi";

class EmployeeApi {
    constructor() {
        this.url = "/account";
    }
    listMember = () => authorApi.get(`${this.url}?role=MEMBER`);

    addMember = (Member) => authorApi.post(`${this.url}`, Member);

    updateMember = (id, Member) => authorApi.put(`${this.url}/${id}`, Member)

    deleteMember = (id) => authorApi.delete(`${this.url}/${id}`)

    // findMemberById = (id) => authorApi.get(`${this.url}/${id}`);
}
export default new EmployeeApi();
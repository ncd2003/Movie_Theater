import authorApi from "./baseAPI/AuthorBaseApi";
class PermissionAPI {
    constructor() {
        this.url = "/permission"
    }
    listPermission = () => authorApi.get(`${this.url}`);

    listPermissionDto = () => authorApi.get(`${this.url}/permissionDto`);

    createPermission = (permission) => authorApi.post(`${this.url}`, permission);

    updatePermission = (id, permission) => authorApi.put(`${this.url}/${id}`, permission);

    deletePermission = (id) => authorApi.delete(`${this.url}/${id}`)
}
export default new PermissionAPI();
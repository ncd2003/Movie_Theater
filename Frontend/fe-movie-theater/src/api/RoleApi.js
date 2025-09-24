import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi";
class RoleAPI {
    constructor() {
        this.url = "/role"
    }
    listRoleDto = () => authorApi.get(`${this.url}/roleDto`);

    listRole = () => authorApi.get(`${this.url}`);

    updateRole = (id, selectedPermissions) => authorApi.put(`${this.url}/${id}`, selectedPermissions);

    fetchPermissionRoleById = (id) => unAuthorApi.get(`${this.url}/client/${id}`)
}
export default new RoleAPI();
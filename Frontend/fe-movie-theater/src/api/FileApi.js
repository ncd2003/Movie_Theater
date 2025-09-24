import authorApi from "./baseAPI/AuthorBaseApi";

class FileAPI {
    constructor() {
        this.url = "/file"; 
    }

    uploadFile = (formData) => authorApi.post(`${this.url}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    deleteFile = (fileUrl) => authorApi.post(`${this.url}/delete?fileUrl=${encodeURIComponent(fileUrl)}`);
    

}

export default new FileAPI();
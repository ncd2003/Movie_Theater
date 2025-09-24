import authorApi from "./baseAPI/AuthorBaseApi";

class VNPayApi {
    callPayment = (data) => authorApi.post("vn-pay", data); // <-- body

    callbackPayment = (params) => authorApi.get("payment-callback", { params }); // query param ok
}

export default new VNPayApi();
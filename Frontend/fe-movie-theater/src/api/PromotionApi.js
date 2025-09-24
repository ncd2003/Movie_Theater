import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi"
class PromotionApi {
  constructor() {
    this.url = "/promotions";
  }
  listPromotion = () => authorApi.get(`${this.url}`);
  createANewPromotion = (promotion) => authorApi.post(`${this.url}`, promotion);
  updatePromotion = (id, promotion) =>authorApi.put(`${this.url}/${id}`, promotion);
  deletePromotion = (id) => authorApi.delete(`${this.url}/${id}`);
  getPromotionById = (id) => unAuthorApi.get(`${this.url}/client/${id}`);
  getPromotions = () => unAuthorApi.get(`${this.url}/client`);
  findAllPromotionsByLocalDateTime = () => unAuthorApi.get(`${this.url}/client/by-local-date-time`)
}
export default new PromotionApi();

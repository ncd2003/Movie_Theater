import authorApi from "./baseAPI/AuthorBaseApi";

class AccountApi {
  constructor() {
    this.url = "/account";
  }
  listAccounts = () => authorApi.get(`${this.url}`);

  addAccount = (account) => authorApi.post(`${this.url}`, account);

  updateAccount = (id, account) => authorApi.put(`${this.url}/${id}`, account);

  deleteAccount = (id) => authorApi.delete(`${this.url}/${id}`);

  getAccount = () => authorApi.get(`${this.url}/profile`);

  fetchAccountMemberByEmailOrPhoneNumber = (valueSearch) =>
    authorApi.get(`${this.url}/search`, { params: { valueSearch } });

  updateStatus = (accountId) =>
    authorApi.put(`${this.url}/updateStatus/${accountId}`);
}
export default new AccountApi();

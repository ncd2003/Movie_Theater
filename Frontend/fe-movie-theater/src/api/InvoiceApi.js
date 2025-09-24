import authorApi from "./baseAPI/AuthorBaseApi";

class InvoiceApi {
  constructor() {
    this.url = "/invoice";
  }
  getAllInvoice = () => authorApi.get(`${this.url}`);

  updateStatusInvoice = async (invoiceId) => {
    try {
      await authorApi.put(`${this.url}/${invoiceId}/update-status`);
      return true;
    } catch (error) {
      console.error("error when update invoice:", error);
      return false;
    }
  };
  
  getInvoiceByAccountId = (accountId) => authorApi.get(`${this.url}/${accountId}`);
  // searchInvoices = (params) => authorApi.get(`${this.url}/search`, { params });
}

export default new InvoiceApi();

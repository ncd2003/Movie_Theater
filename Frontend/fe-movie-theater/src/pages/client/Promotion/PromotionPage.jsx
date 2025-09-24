import React, { useEffect, useState } from "react";
import PromotionCard from "./PromotionCard";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import PromotionApi from "../../../api/PromotionApi";
import { handleApiRequest } from "../../../utils/ApiHandler";

const PromotionPage = () => {
  const [promotionsList, setPromotionsList] = useState([]);

  useEffect(() => {
    fetchAllPromotion();
  }, []);

  const fetchAllPromotion = async () => {
    await handleApiRequest({
      apiCall: () => PromotionApi.getPromotions(),
      onSuccess: (res) => {
        setPromotionsList(res.data);
      },
      showSuccessToast: false,
    });
  };

  return (
    <>
      <Header />

      {/* Tiêu đề chính */}
      <div className="text-center mt-8 mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide text-gray-800 uppercase">
          <span className="border-b-4 border-blue-500 pb-2 px-4">
            News and Offers
          </span>
        </h1>
      </div>

      {/* Danh sách khuyến mãi */}
      <div className="bg-gray-100 py-12 flex justify-center">
        <div className="w-[80%] grid grid-cols-4 gap-10">
          {promotionsList.map((p) => (
            <PromotionCard key={p.id} promotion={p} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PromotionPage;

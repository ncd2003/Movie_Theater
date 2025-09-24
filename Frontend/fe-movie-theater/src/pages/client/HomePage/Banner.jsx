import { useState, useEffect } from 'react';
import { handleApiRequest } from './../../../utils/ApiHandler';
import PromotionApi from '../../../api/PromotionApi';
import { Link } from 'react-router-dom';

function Banner() {
  const [promotionList, setPromotionList] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchAllPromotion();
  }, []);

  const fetchAllPromotion = async () => {
    await handleApiRequest({
      apiCall: () => PromotionApi.getPromotions(),
      onSuccess: (res) => {
        const promotion = res.data.slice(0, 4);
        setPromotionList(promotion);
        if (promotion.length > 0) {
          setActive(promotion[0].promotionId);
        }
      },
      showSuccessToast: false,
    });
  };

  // Tự động chuyển ảnh banner mỗi 5 giây
  useEffect(() => {
    if (promotionList.length === 0) return;

    const interval = setInterval(() => {
      setActive((prevId) => {
        const currentIndex = promotionList.findIndex((m) => m.promotionId === prevId);
        const nextIndex = (currentIndex + 1) % promotionList.length;
        return promotionList[nextIndex].promotionId;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [promotionList]);

  const handlePrevPromotion = () => {
    setActive((prevId) => {
      const currentIndex = promotionList.findIndex((m) => m.promotionId === prevId);
      const prevIndex =
        currentIndex - 1 < 0 ? promotionList.length - 1 : currentIndex - 1;
      return promotionList[prevIndex].promotionId;
    });
  };

  const handleNextPromotion = () => {
    setActive((prevId) => {
      const currentIndex = promotionList.findIndex((m) => m.promotionId === prevId);
      const nextIndex = (currentIndex + 1) % promotionList.length;
      return promotionList[nextIndex].promotionId;
    });
  };

  return (
    <div className='flex '>


      <div
        className='flex-[1] '
        style={{
          backgroundImage:
            "url('https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/bg-bottom-footer.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      ></div>

      {/* Image Banner */}
      <div className='relative flex-[5] overflow-hidden'>
        {promotionList
          .filter((m) => m.promotionId === active)
          .map((m) => (
            <Link key={m.promotionId} to={`/promotions/${m.promotionId}`}>
              <img src={`${m.image}`} alt='LOGO' className='w-full h-[450px] object-cover' />
            </Link>
          ))}


        {/* left  */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.2}
          stroke='currentColor'
          onClick={handlePrevPromotion}
          className='size-16 absolute bottom-[45%] hover:text-white opacity-50 text-slate-300'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 19.5 8.25 12l7.5-7.5'
          />
        </svg>

        {/* Right */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.2}
          stroke='currentColor'
          onClick={handleNextPromotion}
          className='size-16 absolute bottom-[202.5px] left-[93%]  hover:text-white opacity-50 text-slate-300'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m8.25 4.5 7.5 7.5-7.5 7.5'
          />
        </svg>

        {/* Paginate */}
        <ul className='absolute bottom-[10px] left-1/2 flex gap-2 '>
          {promotionList.map((m) => (
            <li
              key={m.promotionId}
              className={`py-[5.5px] px-[5.5px] rounded-full ${m.promotionId === active ? 'bg-slate-100' : 'bg-slate-600'
                }`}
            ></li>
          ))}
        </ul>
      </div>

      <div
        className='flex-[1] '
        style={{
          backgroundImage:
            "url('https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/bg-bottom-footer.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      ></div>
    </div>
  );
}

export default Banner;

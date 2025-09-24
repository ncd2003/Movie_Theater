import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleApiRequest } from "../../../utils/ApiHandler";


function Movie(props) {
  const { id, name, actor, content, duration, image, trailer, fromDate } = props;

  const navigate = useNavigate();

  return (
    <>
      <div className='w-[260px] h-[452px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200'>
        {/* Wrapper cho hình ảnh + overlay */}
        <div className='relative group'>
          {/* Poster */}
          <img
            src={`${image}`}
            alt={name}
            className='w-full h-[350px] object-cover'
          />

          {/* Overlay với hai nút */}
          <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col  items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <Link
              to={`/ticketing/${id}`}
              className='bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700'
            >
              Ticket
            </Link>
            <Link
              to={`/movies/${id}`}
              className='bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-900'
            >
              Detail
            </Link>
          </div>
        </div>

        {/* Thông tin phim */}
        <div className='p-4 text-center'>
          {/* Nhãn độ tuổi + Tên phim */}
          <div className='flex items-center justify-center gap-x-1'>
            <h3 className='text-lg font-bold text-gray-900 uppercase truncate w-[200px] text-center'>
              {name}
            </h3>
          </div>

          {/* Thời lượng + Ngày khởi chiếu */}
          <p className='text-gray-500 text-sm mt-2'>
            {duration} minutes | {new Date(fromDate).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </>
  );
}

export default Movie;

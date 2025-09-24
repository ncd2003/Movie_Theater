import React, { useState, useEffect } from 'react';
import { handleApiRequest } from '../../../utils/ApiHandler';
import MovieApi from '../../../api/MovieApi';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../../Footer/Footer';

function NowMovie() {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]); // Danh sách phim sau khi lọc

  useEffect(() => {
    fetchAllMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movieList]);

  const fetchAllMovies = async () => {
    await handleApiRequest({
      apiCall: () => MovieApi.getAllMovies(),
      onSuccess: (res) => {
        setMovieList(res.data);
      },
      showSuccessToast: false,
    });
  };

  console.log(movieList);

  const filterMovies = () => {
    const today = new Date(); // day now
    const filtered = movieList.filter((movie) => {
      const fromDate = new Date(movie.fromDate);
      const toDate = new Date(movie.toDate);
      return fromDate <= today && today <= toDate; // nowShowing
    });
    setFilteredMovies(filtered);
  };

  console.log(filteredMovies);

  return (
    <>
      <Header />

      <div className='mx-20 mt-2'>
        {/* Type filter */}
        <div className='flex justify-between border-b-black border-b-2'>
          <h1 className='text-[#222] text-5xl mb-5'> Movies Showing </h1>
          <Link to='/movies/coming-soon'>
            <h1 className='mt-8 text-2xl text-[#666]'> Upcoming Movies </h1>
          </Link>
        </div>

        <div className='grid grid-cols-4 mt-5 gap-y-5'>
          {filteredMovies.map((m) => (
            <div className='w-[260px] h-[452px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200'>
              {/* Wrapper cho hình ảnh + overlay */}
              <div className='relative group'>
                {/* Poster */}
                <img
                  src={`${m.image}`}
                  alt={m.movieName}
                  className='w-full h-[350px] object-cover'
                />

                {/* Overlay với hai nút */}
                <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col  items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <Link
                    to={`/ticketing/${m.movieId}`}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700'
                  >
                    Ticket
                  </Link>
                  <Link
                    to={`/movies/${m.movieId}`}
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
                    {m.movieName}
                  </h3>
                </div>

                {/* Thời lượng + Ngày khởi chiếu */}
                <p className='text-gray-500 text-sm mt-2'>
                  {m.duration} minutes |{' '}
                  {new Date(m.fromDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer/>      

    </>
  );
}

export default NowMovie;

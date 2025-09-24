import React, { useEffect, useState } from 'react';
import Footer from '../../../layouts/Footer/Footer';
import Header from '../../../layouts/Header/Header';
import { Link, useParams } from 'react-router-dom';
import { handleApiRequest } from './../../../utils/ApiHandler';
import MovieApi from '../../../api/MovieApi';
import MovieTypeApi from '../../../api/MovieTypeApi';

function MovieDetail() {
  const param = useParams();

  //Show Trailer
  const [showTrailer, setShowTrailer] = useState(false);
  const [movieById, setMovieById] = useState({});
  const [movieTypes, setMovieTypes] = useState([]);

  useEffect(() => {
    fetchMovieById(param.id);
    fetchMovieTypes(param.id);
  }, []);

  const fetchMovieById = async (id) => {
    await handleApiRequest({
      apiCall: () => MovieApi.getMovieById(id),
      onSuccess: (res) => {
        setMovieById(res.data);
      },
      showSuccessToast: false,
    });
  };

  const fetchMovieTypes = async (id) => {
    await handleApiRequest({
      apiCall: () => MovieTypeApi.getTypesByMovieId(id),
      onSuccess: (typeRes) => {
        setMovieTypes(typeRes.data || []);
      },
      showSuccessToast: false,
      errorMessage: "Failed to fetch movie types.",
    });
  };

  console.log(movieById);

  return (
    <>

      <Header />

      {/* Nội dung */}
      <div className='mt-10 mx-20'>
        <div>
          <h1 className='font-bold text-[#222] text-3xl '> Movie Details </h1>
          <p className='border-b-2 border-[#222] my-3'> </p>
        </div>

        <div className='flex gap-5'>
          {/* img */}
          <img
            src={`${movieById.image}`}
            alt={movieById.movieName}
            className='w-1/5 h-auto object-cover'
          />

          {/* Thông tin phim */}
          <div>
            <h1 className='text-[#222] text-3xl'> {movieById.movieName} </h1>
            <div className='border-b-2 my-3'> </div>

            <p>
              <span className='font-bold text-[#222]'> Director : </span>
              <span> {movieById.director} </span>
            </p>
            <p>
              <span className='font-bold text-[#222]'> Cast: </span>
              {movieById.actor}
            </p>

            <p>
              <span className='font-bold text-[#222]'> Genre: </span>
              {movieTypes.map((type, index) => (
                <span key={index}>
                  {type.typeName}
                  {index < movieTypes.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <p>
              <span className='font-bold text-[#222]'> Release Date: </span>
              {new Date(movieById.fromDate).toLocaleDateString('vi-VN')}
            </p>
            <p>
              <span className='font-bold text-[#222]'> Running Time: </span> {movieById.duration}{' '}
              minutes
            </p>
            <p>
              <span className='font-bold text-[#222]'> Version: </span> {movieById.version}
            </p>

            {/* Buy Ticket */}
            <Link
              to={`/ticketing/${movieById.movieId}`}
              className='bg-red-600 text-white font-bold py-1 px-3 rounded-lg border-2 border-red-400 relative inline-block mt-2'
            >
              <span className='absolute inset-0 border-2 border-red-300 rounded-lg'></span>
              <div className='flex items-center gap-2 relative'>
                <span className='uppercase'>Buy Ticket</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Over View */}
        <div className='mt-7'>
          <ul className='flex items-center gap-2 mb-3'>
            <li className='font-bold'> Detail | </li>
            <li>
              <button
                onClick={() => setShowTrailer(true)}
                className='font-bold text-blue-500 underline'
              >
                Trailer
              </button>
            </li>
          </ul>

          <p>{movieById.content}</p>
        </div>
      </div>

      {/* Video Trailer Edit Here */}
      {showTrailer && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-80'>
          <div className='relative bg-black p-5 rounded-lg'>
            <button
              className='absolute top-2 right-2 bg-red-500 text-white px-2 rounded'
              onClick={() => setShowTrailer(false)}
            >
              X
            </button>
            {/* Chú ý khi copy link trên youtube thì phải xóa chỗ watch?v= thay vào đó là embed/ */}
            <iframe
              width='560'
              height='320'
              src={movieById.trailer} // edit src here
              title='Trailer'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}

export default MovieDetail;

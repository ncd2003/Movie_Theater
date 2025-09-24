import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { handleApiRequest } from './../../../utils/ApiHandler';
import MovieApi from '../../../api/MovieApi';
import Movie from './Movie.jsx';

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [filterType, setFilterType] = useState('now_showing'); // "now_showing" | "coming_soon"
  const [filteredMovies, setFilteredMovies] = useState([]);  // Danh sách phim sau khi lọc
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchAllMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movieList, filterType, showMore]);

  const fetchAllMovies = async () => {
    await handleApiRequest({
      apiCall: () => MovieApi.getAllMovies(),
      onSuccess: (res) => {
        setMovieList(res.data);
      },
      showSuccessToast: false,
    });
  };

  // filter now showing or coming soon
  const filterMovies = () => {
    const today = new Date();           // day now
    const filtered = movieList.filter((movie) => {
      const fromDate = new Date(movie.fromDate);
      const toDate = new Date(movie.toDate);
      if (filterType === 'now_showing') {
        return fromDate <= today && today <= toDate; // now showing
      } else {
        return fromDate > today; // coming soon
      }
    });

    const filterUpdate = showMore ? filtered : filtered.slice(0, 8);
    setFilteredMovies(filterUpdate);
  };

  return (
    <>
      <section className='mt-3 mx-20'>
        {/* phim đang chiếu/ phim sắp chiếu */}
        <div className='flex gap-x-1 items-center justify-center'>
          <button
            onClick={() => setFilterType('now_showing')}
            className={`w-[175px] h-[50px] text-[16px] font-bold ${filterType === 'now_showing'
                ? 'bg-[#231f20] text-[#cdc197]'
                : 'bg-[#f0e8c8]'
              }`}
          >
            Movies Showing
          </button>
          <button
            onClick={() => setFilterType('coming_soon')}
            className={`w-[175px] h-[50px] text-[16px] font-bold ${filterType === 'coming_soon'
                ? 'bg-[#231f20] text-[#cdc197]'
                : 'bg-[#f0e8c8]'
              }`}
          >
            Upcoming Movies
          </button>
        </div>

        {/* Danh sach các phim */}
        <div className='grid grid-cols-4 mt-5 gap-y-5'>
          {filteredMovies.map((m) => (
            <Movie
              key={m.movieId}
              id={m.movieId}
              name={m.movieName}
              actor={m.actor}
              content={m.content}
              duration={m.duration}
              image={m.image}
              trailer={m.trailer}
              fromDate={m.fromDate}
            />
          ))}
        </div>

        {/* Load More */}
        <div className='bg-[rgb(239,239,239)] border py-2 mt-2 text-center'>
          {showMore ? (
            <button
              className='font-semibold text-black'
              onClick={() => setShowMore(!showMore)}
            >
              Less
              <div className='mt-[-15px]'>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 ml-1'></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1'></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
              </div>
            </button>
          ) : (
            <button
              className='font-semibold text-black'
              onClick={() => setShowMore(!showMore)}
            >
              More
              <div className='mt-[-15px]'>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 ml-1'></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1'></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
                <div className='h-1 w-1 mx-auto  bg-gray-500 inline-block mr-1 '></div>
              </div>
            </button>
          )}
        </div>
      </section>
    </>
  );
}

export default MovieList;

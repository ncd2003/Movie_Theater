import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { handleApiRequest } from "../../../utils/ApiHandler";
import MovieApi from "../../../api/MovieApi";
import { toast } from "react-toastify";
export default function Ticketing() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("sv-SE") // Định dạng YYYY-MM-DD mà không bị ảnh hưởng bởi múi giờ
  );

  const [startIndex, setStartIndex] = useState(0);
  // Lấy ngày hôm nay và tạo danh sách 21 ngày tiếp theo
  const today = new Date();
  const dates = Array.from({ length: 21 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  // Hiển thị chỉ 7 ngày từ startIndex
  const visibleDates = dates.slice(startIndex, startIndex + 7);

  // Movie
  const [movieData, setMovieData] = useState([]);
  const param = useParams();
  const navigate = useNavigate();
  const fetchMovieData = async () => {
    const validDate = selectedDate || new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await handleApiRequest({
      apiCall: () => MovieApi.getMoviesByDate(validDate),
      onSuccess: (res) => {
        // console.log("res",res)
        if (param.id) {
          setMovieData(res.data.filter(s => s.movieId === parseInt(param.id)));
          setSelectedDate(res?.data?.showDate || validDate); // Giữ giá trị hợp lệ
        } else {
          setMovieData(res.data);
        }
      },
      showSuccessToast: false
    });
  };

  useEffect(() => {
    fetchMovieData();
  }, [selectedDate, param.id]);


  const handleMoveOnSelectSeat = (movieIdIndex, scheduleIdIndex) => {

    const selectedMovie = movieData.find(movie => movie.movieId === movieIdIndex);

    if (selectedMovie) {
      const selectedSchedule = selectedMovie.movieSchedules.find(schedule => schedule.scheduleId === scheduleIdIndex);

      if (selectedSchedule) {
        // Chỉ giữ lại lịch chiếu đã chọn
        const filteredMovie = {
          ...selectedMovie,
          movieSchedules: [selectedSchedule] // Chỉ giữ lại schedule được chọn
        };
        // if (!localStorage.getItem("access_token")) {
        //   navigate("/user/signIn")
        //   toast.info("Please sign in!")
        // } else {
        navigate("/ticketing/person-seat-select", { state: filteredMovie });
        // }
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <div className="flex-grow p-4">
        {/* Lưới ngày tháng có nút back/next */}
        <div className="flex items-center justify-center mx-32 gap-2">
          <button
            onClick={() => setStartIndex((prev) => Math.max(0, prev - 7))}
            disabled={startIndex === 0}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <KeyboardDoubleArrowLeftIcon />
          </button>

          <div className="grid grid-cols-7 gap-1 text-center">
            {visibleDates.map((date, index) => {
              const formattedDate = date.toLocaleDateString("sv-SE");

              return (
                <button
                  key={index}
                  className={`border-[1.8px] p-1 text-lg rounded-md ${selectedDate === formattedDate
                    ? "bg-black text-white font-bold"
                    : "hover:bg-gray-200"
                    }`}
                  onClick={() => setSelectedDate(formattedDate)}
                >
                  <p className="text-xs">
                    {date.toLocaleDateString("en-GB", {
                      month: "2-digit",
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-2xl">{date.getDate()}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStartIndex((prev) => Math.min(prev + 7, dates.length - 7))}
            disabled={startIndex + 7 >= dates.length}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <KeyboardDoubleArrowRightIcon />
          </button>
        </div>

        {/* Movies */}
        {movieData?.map((m) => (
          <div key={m.movieId} className="border-t mt-4 pt-4 mx-32 flex gap-4 items-start">
            {/* Ảnh phim */}
            {/* <img src={m.image} alt={m.movieName} className="w-32 h-48 rounded-md object-cover" /> */}
            <img src={m.image} alt={m.movieName} className="w-32 h-48 rounded-md object-cover" />

            {/* Thông tin phim */}
            <div>
              <h2 className="text-xl font-semibold">{m.movieName}</h2>

              <div className="flex flex-wrap gap-2 mt-2">
                {[...m.movieSchedules]
                  .sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime)) // sort tăng dần
                  .map((ms) => (
                    <span
                      key={ms.scheduleId}
                      className="px-3 py-1 bg-gray-200 text-sm rounded-md cursor-pointer hover:bg-gray-300"
                    >
                      <p onClick={() => handleMoveOnSelectSeat(m.movieId, ms.scheduleId)}>
                        {ms.scheduleTime.split(":").slice(0, 2).join(":")}
                      </p>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

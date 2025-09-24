import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fullName = localStorage.getItem("fullName");
    const storedRoleId = localStorage.getItem("roleId");

    if (fullName) {
      setUser(fullName);
    }
    if (storedRoleId) {
      setRole(Number(storedRoleId));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("roleId");
    localStorage.removeItem("role");
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accountId");
    setUser(null);
    setRole(null);
    navigate("/");
  };

  return (
    <header
      className="container mx-auto flex flex-wrap items-center justify-between
    px-4 py-3 md:px-8 lg:px-16"
    >
      {/* Logo */}
      <div className="w-1/3 sm:w-auto">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-36 sm:w-48 md:w-56" />
        </Link>
      </div>

      {/* Feature */}
      <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-10">
        {/* PHIM với Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link to="/" className="text-gray-700 text-lg hover:text-blue-600">
            MOVIE
          </Link>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 mt-0 w-44 bg-white shadow-lg rounded-lg border z-50">
              <Link
                to="/movies/now-showing"
                className="block px-4 py-2 hover:bg-gray-200 rounded-t-lg"
              >
                Movies Showing
              </Link>
              <Link
                to="/movies/coming-soon"
                className="block px-4 py-2 hover:bg-gray-200 rounded-b-lg"
              >
                Upcoming Movies
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/promotions"
          className="text-gray-700 text-lg hover:text-blue-600"
        >
          PROMOTION
        </Link>

        <Link
          to="/ticketing"
          className="text-gray-700 text-lg hover:text-blue-600"
        >
          BOOK TICKET
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-x-4">
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              to={`/customer/account-edit`}
              className="flex items-center bg-gray-200 rounded-lg py-[2px] px-[2px] hover:bg-blue-600 text-gray-700 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="size-9 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <span className=" text-[17px] inline-block">Hi, {user}</span>
            </Link>

            {(role === 1 || role === 2) && (
              <Link
                to="/admin/rooms-management"
                className="bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg px-4 py-2 text-sm md:text-base "
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg px-4 py-2 text-sm md:text-base "
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/user/signIn"
              className="bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg px-4 py-2 text-sm md:text-base "
            >
              Sign In
            </Link>
            <Link
              to="/user/signUp"
              className="bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg px-4 py-2 text-sm md:text-base"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

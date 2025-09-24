import { lazy } from "react";

// Admin Pages
const CreateMovie = lazy(() => import("./pages/admin/movie/CreateMovie"));
const MoviesManagement = lazy(() =>
  import("./pages/admin/movie/MoviesManagement")
);
const UpdateMovie = lazy(() => import("./pages/admin/movie/UpdateMovie"));
const AddScheduleByRange = lazy(() =>
  import("./pages/admin/movie/AddScheduleByRange")
);
const ScheduleManagement = lazy(() =>
  import("./pages/admin/movie/ScheduleManagement")
);
const AccountManagement = lazy(() =>
  import("./pages/admin/account/AccountManagement")
);
const SignInAdmin = lazy(() => import("./pages/admin/signIn/signInAdmin"));
const CinemaRoom = lazy(() =>
  import("./pages/admin/cinemaRoom/CinemaRoomManagement")
);
const SetupSeat = lazy(() => import("./pages/admin/seat/SetupSeat"));
const EditSetupSeat = lazy(() => import("./pages/admin/seat/EditSetupSeat"));
const DisplaySetupSeat = lazy(() =>
  import("./pages/admin/seat/DisplaySetupSeat")
);
const SeatType = lazy(() =>
  import("./pages/admin/seatType/SeatTypeManagement")
);
const SeatStatus = lazy(() =>
  import("./pages/admin/seatStatus/SeatStatusManagement")
);
const AdminPromotionPage = lazy(() =>
  import("./pages/admin/promotion/PromotionManagement")
);
const PermissionManagement = lazy(() =>
  import("./pages/admin/permission/PermissionManagement")
);
const RoleManagement = lazy(() => import("./pages/admin/role/RoleManagement"));

// Protected Routes & Layouts
const ProtectedRoute = lazy(() => import("./utils/ProtectedRoute"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));

// Homepage & Authentication
const HomePage = lazy(() => import("./pages/client/homepage/Home"));
const SignIn = lazy(() => import("./pages/client/signIn/SignIn"));
const SignUp = lazy(() => import("./pages/client/signUp/SignUp"));

// Movie Details & Ticket Booking
const DetailMovie = lazy(() => import("./pages/client/MovieList/MovieDetail"));
const TicketingUser = lazy(() => import("./pages/client/ticket/Ticketing"));
const PersonSeatSelect = lazy(() =>
  import("./pages/client/ticket/PersonSeatSelect")
);
const Payment = lazy(() => import("./pages/client/ticket/Payment"));

// Movie Filtering
const NowShowing = lazy(() =>
  import("./layouts/Header/FilterMovieHeader/NowMovie")
);
const ComingMovie = lazy(() =>
  import("./layouts/Header/FilterMovieHeader/ComingMovie")
);

// User Dashboard
const ProfileUser = lazy(() =>
  import("./pages/client/ProfileUser/ProfileUser")
);
const AccountUserDetail = lazy(() =>
  import("./pages/client/DashBoard/AccountUserDetail")
);
const ChangePassWordUser = lazy(() =>
  import("./pages/client/DashBoard/ChangePasswordUser")
);
const HistoryUser = lazy(() => import("./pages/client/DashBoard/HistoryUser"));
const BookedTicketUser = lazy(() =>
  import("./pages/client/DashBoard/BookedTicketUser")
);

// Password Reset
const VerifyOtp = lazy(() => import("./pages/client/resetpassword/VerifyOtp"));
const SetPasswordUser = lazy(() =>
  import("./pages/client/resetpassword/SetPasswordUser")
);

// Payment & Invoices
const PaymentResult = lazy(() => import("./pages/payment/PaymentResult"));
const InvoiceManagement = lazy(() =>
  import("./pages/client/invoice/InvoiceManagement")
);

// Promotions
const PromotionPage = lazy(() =>
  import("./pages/client/promotion/PromotionPage")
);
const PromotionDetail = lazy(() =>
  import("./pages/client/promotion/PromotionDetail")
);

// Error Pages
const Page403 = lazy(() => import("./pages/auth/Page403"));
const Page404 = lazy(() => import("./pages/auth/Page404"));
const Page500 = lazy(() => import("./pages/auth/Page500"));

const routes = [
  // Admin Routes
  { path: "/auth/signIn", element: <SignInAdmin /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ), // Bọc toàn bộ admin route
    children: [
      // cinema room
      { path: "rooms-management", element: <CinemaRoom /> },
      // seat type
      { path: "seat-types-management", element: <SeatType /> },
      //seat status
      { path: "seat-status-management", element: <SeatStatus /> },
      // permissions
      { path: "permission-management", element: <PermissionManagement /> },
      // account
      { path: "account-management", element: <AccountManagement /> },
      // role
      { path: "role-management", element: <RoleManagement /> },
      // Seat Management
      {
        path: "seats",
        children: [
          { path: "setupSeats/:id", element: <SetupSeat /> },
          { path: "editSetupSeat/:id", element: <EditSetupSeat /> },
          { path: "displaySetupSeat/:id", element: <DisplaySetupSeat /> },
        ],
      },
      //Movies
      {
        path: "movies",
        children: [
          { path: "create-movie", element: <CreateMovie /> },
          { path: "update-movie", element: <UpdateMovie /> },
          { path: "movie-management", element: <MoviesManagement /> },
          { path: "add-by-range", element: <AddScheduleByRange /> },
          { path: "schedule-management", element: <ScheduleManagement /> },
        ],
      },
      // Promotion
      {
        path: "promotion-management",
        element: <AdminPromotionPage />,
      },
      // Invoice
      {
        path: "invoice",
        element: <InvoiceManagement />,
      },
    ],
  },

  // Client Routes
  {
    path: "",
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/user",
        children: [
          { path: "signIn", element: <SignIn /> },
          { path: "signUp", element: <SignUp /> },
        ],
      },
      // UserDashBoard
      {
        path: "/customer",
        children: [
          {
            path: "account-edit",
            element: (
              <ProtectedRoute>
                <AccountUserDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: "change-password",
            element: <ChangePassWordUser />,
          },
          {
            path: "reset-password",
            element: <SetPasswordUser />,
          },
          {
            path: "verify-otp",
            element: <VerifyOtp />,
          },
          {
            path: "history",
            element: (
              <ProtectedRoute>
                <HistoryUser />
              </ProtectedRoute>
            ),
          },
          {
            path: "booked-ticket",
            element: (
              <ProtectedRoute>
                <BookedTicketUser />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // Filter movie type for header
      {
        path: "/movies",
        children: [
          {
            path: "now-showing",
            element: <NowShowing />,
          },
          {
            path: "coming-soon",
            element: <ComingMovie />,
          },
          {
            path: ":id",
            element: <DetailMovie />,
          },
        ],
      },
      // Ticketing & Seating
      {
        path: "/ticketing",
        children: [
          {
            path: "",
            element: <TicketingUser />,
          },
          {
            path: ":id",
            element: <TicketingUser />,
          },
          {
            path: "person-seat-select",
            element: (
              <ProtectedRoute>
                <PersonSeatSelect />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Payment & Invoice
      {
        path: "/payment",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },

      // Payment result
      {
        path: "/payment-result",
        element: (
          <ProtectedRoute>
            <PaymentResult />
          </ProtectedRoute>
        ),
      },

      //Profile User
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfileUser />
          </ProtectedRoute>
        ),
      },

      // Promotions
      {
        path: "/promotions",
        children: [
          { path: "", element: <PromotionPage /> },
          { path: ":id", element: <PromotionDetail /> },
        ],
      },
    ],
  },

  {
    path: "/auth",
    children: [
      {
        path: "Page403",
        element: <Page403 />,
      },
      {
        path: "Page404",
        element: <Page404 />,
      },
      {
        path: "Page500",
        element: <Page500 />,
      },
    ],
  },
];

export default routes;

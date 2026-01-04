// Libraries dependencies
import { Routes, Route, Outlet, useLocation } from "react-router-dom"; // ✅ Added useLocation, Removed Navigate
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ProfilePage from "./pages/MyProfilePage/ProfilePage";
import RentBikePage from "./pages/RentBikePage/RentBikePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import PricingPage from "./pages/PricingPage/PricingPage";
import FleetPage from "./pages/FleetPage/FleetPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ContactPage from "./pages/ContactPage/ContactPage";

// Components & Utils
import MainLayout from "./components/MainLayout/MainLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicOnlyRoute from "./components/Auth/PublicOnlyRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import RentalsPage from "./pages/RentalsPage/RentalsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage/UnauthorizedPage";
import UserManagementPage from "./pages/Admin/UserManagementPage/UserManagementPage";
import CalendarPage from "./pages/Admin/CalendarPage/CalendarPage";
import PanelPage from "./pages/Admin/PanelPage/PanelPage";
import AdminLayout from "./pages/Admin/AdminLayout/AdminLayout";
import Redirect from "./components/common/Redirect"; // Added custom Redirect to fix crash
import { toastConfig } from "./utils/toastConfig";

const App = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={toastConfig}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Public ONLY routes (Login/Register) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes (Client & Admin) */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-rentals" element={<RentalsPage />} />
            </Route>
            <Route path="/rent-bike" element={<RentBikePage />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Replaced Navigate with Redirect to prevent AnimatePresence crash */}
            <Route index element={<Redirect to="panel" />} />

            <Route path="panel" element={<PanelPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;

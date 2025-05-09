import { Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import ComplimentPage from "./Pages/ComplimentPage";
import DrinkVotePage from "./Pages/DrinkVotePage";
import JukeboxPage from "./Pages/JukeboxPage";
import GamesPage from "./Pages/GamesPage";
import FeedbackPage from "./Pages/FeedbackPage";
import AdminFeedbackPanel from "./Pages/AdminFeedbackPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import AdminHeader from "./Components/AdminHeader";
import { useLocation } from "react-router-dom";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="h-full">
      {isAdminRoute ? <AdminHeader /> : <Navbar />}
      <Routes>
        <Route path="/" element={<FeedbackPage />} />
        <Route path="/jukebox" element={<JukeboxPage />} />
        <Route path="/login" element={<AdminLogin></AdminLogin>} />

        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute>
              <AdminFeedbackPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/register"
          element={
            <ProtectedRoute>
              <AdminRegister></AdminRegister>
            </ProtectedRoute>
          }
        />

       
      </Routes>
    </div>
  );
}

export default App;

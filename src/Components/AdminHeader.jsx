import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // or use any icon set you like

export default function AdminHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-green-700 text-white shadow-md w-full">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Hamburger Icon (Mobile Only) */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => navigate('/admin/feedback')}
            className="hover:text-green-100 transition"
          >
            Review Feedbacks
          </button>

          <button
            onClick={() => navigate('/admin/snacksuggestions')}
            className="hover:text-green-100 transition"
          >
            Snack Suggestions
          </button>

          <button
            onClick={() => navigate('/admin/register')}
            className="hover:text-green-100 transition"
          >
            Register Admin
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-green-700 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 bg-green-700">
          <button
            onClick={() => {
              navigate('/admin/feedback');
              setIsMenuOpen(false);
            }}
            className="text-left hover:text-green-100 transition"
          >
            Review Feedbacks
          </button>

          <button
            onClick={() => {
              navigate('/admin/snacksuggestions');
              setIsMenuOpen(false);
            }}
            className="text-left hover:text-green-100 transition"
          >
            Snack Suggestions
          </button>

          <button
            onClick={() => {
              navigate('/admin/register');
              setIsMenuOpen(false);
            }}
            className="text-left hover:text-green-100 transition"
          >
            Register Admin
          </button>

          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="bg-white text-green-700 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition w-max"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

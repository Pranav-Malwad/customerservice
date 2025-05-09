import { useNavigate } from 'react-router-dom';

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // or '/'
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <nav className="flex gap-6 items-center">
          <button
            onClick={() => navigate('/admin/feedback')}
            className="hover:text-green-100 transition"
          >
            Review Feedbacks
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
    </header>
  );
}

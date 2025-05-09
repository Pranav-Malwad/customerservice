import { useEffect, useState } from 'react';

export default function AdminFeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('https://customerservice-mf18.onrender.com/api/feedback', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch');
        }

        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message || 'Failed to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="p-6 bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] shadow-xl rounded-2xl animate-fade-in">
        <h1 className="text-3xl font-extrabold text-[#065f46] text-center mb-6">📬 Customer Feedbacks</h1>

        {loading && <p className="text-center text-[#065f46]">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && feedbacks.length === 0 && (
          <p className="text-center text-[#065f46]">No feedback submitted yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white border border-[#a7f3d0] rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500 mb-1">
                Name: <span className="text-[#065f46] font-medium">{fb.name}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Email: <span className="text-[#065f46] font-medium">{fb.email}</span>
              </p>
              <p className="text-gray-700 mt-2 italic">“{fb.message}”</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

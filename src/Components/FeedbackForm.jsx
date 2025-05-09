import { useState } from 'react';

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const response = await fetch('https://customerservice-mf18.onrender.com/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    if (response.ok) {
      setStatus('Feedback submitted successfully!');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus(result.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 p-6 bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] shadow-xl rounded-2xl text-[#065f46] animate-fade-in">
      <h2 className="text-2xl font-extrabold text-center mb-4">Feedback Form</h2>

      {status && (
        <div className="mb-4 text-center text-[#10b981] font-medium">{status}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#a7f3d0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34d399] bg-white text-[#065f46]"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#a7f3d0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34d399] bg-white text-[#065f46]"
          required
        />
        <textarea
          name="message"
          placeholder="Your Feedback"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#a7f3d0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#34d399] bg-white text-[#065f46]"
          rows={4}
          required
        ></textarea>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#10b981] hover:bg-[#059669] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}

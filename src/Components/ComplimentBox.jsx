import { useEffect, useState } from 'react';

export default function ComplimentBox() {
  const [quote, setQuote] = useState({ content: 'Loading...', author: '' });

  useEffect(() => {
    fetch('https://quotes-api-self.vercel.app/quote') // or fallback: https://api.quotable.io/random
      .then((res) => res.json())
      .then((data) =>
        setQuote({
          content: data.quote || data.content,
          author: data.author || 'Unknown',
        })
      )
      .catch(() =>
        setQuote({
          content: "You're doing amazing!",
          author: 'Unknown',
        })
      );
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] shadow-xl text-center animate-fade-in">
      <h1 className="text-2xl font-extrabold text-[#065f46] mb-4">🌿 Quote of the Day</h1>
      <p className="text-lg text-[#065f46] italic mb-2 transition-opacity duration-500 ease-in-out">
        “{quote.content}”
      </p>
      <p className="text-sm text-[#10b981] font-medium">— {quote.author}</p>
    </div>
  );
}

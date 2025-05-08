import { useEffect, useState } from 'react';

export default function ComplimentBox() {
  const [quote, setQuote] = useState({ content: 'Loading...', author: '' });

  useEffect(() => {
    fetch('https://quotes-api-self.vercel.app/quote') // or 'https://api.quotable.io/random'
      .then((res) => res.json())
      .then((data) => setQuote({ content: data.quote || data.content, author: data.author }))
      .catch(() => setQuote({ content: "You're doing amazing!", author: 'Unknown' }));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-xl bg-gradient-to-br from-green-100 to-blue-200 shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🌟 Quote of the Day</h1>
      <p className="text-xl text-gray-700 italic mb-2">“{quote.content}”</p>
      <p className="text-sm text-gray-600">— {quote.author}</p>
    </div>
  );
}

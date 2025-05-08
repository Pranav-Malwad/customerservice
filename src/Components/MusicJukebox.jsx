import { useState, useEffect } from 'react';

export default function MusicJukebox() {
  const [song, setSong] = useState('');
  const [songList, setSongList] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const response = await fetch('http://localhost:5000/api/songs');
    const data = await response.json();
    setSongList(data);
  };

  const handleSongChange = (e) => {
    setSong(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (song.trim()) {
      const response = await fetch('http://localhost:5000/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songName: song }),
      });

      const newSong = await response.json();
      setSongList([newSong, ...songList]);
      setSong('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/songs/${id}`, {
      method: 'DELETE',
    });
    setSongList(songList.filter((song) => song._id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-br from-green-100 to-yellow-200 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">🎶 Music Jukebox</h2>

      <p className="text-lg mb-6 text-gray-700">
        Suggest your favorite song and we'll add it to the playlist!
      </p>

      {/* Song Suggestion Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={song}
          onChange={handleSongChange}
          className="w-full px-4 py-2 border rounded-md border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Enter song name"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          Add Song
        </button>
      </form>

      {/* Suggested Songs List */}
      {songList.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-3 max-h-48 overflow-y-auto">
          <h3 className="text-lg font-semibold text-amber-800">Requested Songs:</h3>
          <ul className="text-gray-700 space-y-2">
            {songList.map((song) => (
              <li
                key={song._id}
                className="px-4 py-2 bg-yellow-100 rounded-md shadow-sm hover:shadow-lg transition-all"
              >
                {song.songName}
                <button
                  onClick={() => handleDelete(song._id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No song suggestions yet! Be the first to suggest.</p>
      )}
    </div>
  );
}

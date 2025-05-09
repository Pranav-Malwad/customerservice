// import { useState, useEffect } from 'react';

// export default function MusicJukebox() {
//   const [song, setSong] = useState('');
//   const [songList, setSongList] = useState([]);

//   useEffect(() => {
//     fetchSongs();
//   }, []);

//   const fetchSongs = async () => {
//     const response = await fetch('https://customerservice-mf18.onrender.com/api/songs');
//     const data = await response.json();
//     setSongList(data);
//   };

//   const handleSongChange = (e) => {
//     setSong(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (song.trim()) {
//       const response = await fetch('https://customerservice-mf18.onrender.com/api/songs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ songName: song }),
//       });

//       const newSong = await response.json();
//       setSongList([newSong, ...songList]);
//       setSong('');
//     }
//   };

//   const handleDelete = async (id) => {
//     await fetch(`https://customerservice-mf18.onrender.com/api/songs/${id}`, {
//       method: 'DELETE',
//     });
//     setSongList(songList.filter((song) => song._id !== id));
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-br from-green-100 to-yellow-200 rounded-xl shadow-lg text-center">
//       <h2 className="text-2xl font-bold text-amber-800 mb-4">🎶 Music Jukebox</h2>

//       <p className="text-lg mb-6 text-gray-700">
//         Suggest your favorite song and we'll add it to the playlist!
//       </p>

//       {/* Song Suggestion Form */}
//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           type="text"
//           value={song}
//           onChange={handleSongChange}
//           className="w-full px-4 py-2 border rounded-md border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
//           placeholder="Enter song name"
//         />
//         <button
//           type="submit"
//           className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
//         >
//           Add Song
//         </button>
//       </form>

//       {/* Suggested Songs List */}
//       {songList.length > 0 ? (
//         <div className="bg-white p-4 rounded-lg shadow-md space-y-3 max-h-48 overflow-y-auto">
//           <h3 className="text-lg font-semibold text-amber-800">Requested Songs:</h3>
//           <ul className="text-gray-700 space-y-2">
//             {songList.map((song) => (
//               <li
//                 key={song._id}
//                 className="px-4 py-2 bg-yellow-100 rounded-md shadow-sm hover:shadow-lg transition-all"
//               >
//                 {song.songName}
//                 <button
//                   onClick={() => handleDelete(song._id)}
//                   className="ml-4 text-red-600 hover:text-red-800"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p className="text-gray-500 mt-4">No song suggestions yet! Be the first to suggest.</p>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from 'react';

const CLIENT_ID = 'd9e0bafffdd64ff2927ab81faeaf12da'; // Your Spotify Client ID
const REDIRECT_URI = 'https://complimenter.netlify.app/'; // Replace with your Redirect URI
const SCOPES = 'user-modify-playback-state user-read-playback-state user-read-currently-playing streaming';

export default function MusicJukebox() {
  const [song, setSong] = useState('');
  const [songList, setSongList] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // UseEffect to check if the user is logged in by checking for an access token
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('spotify_token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        ?.split('=')[1];

      window.location.hash = '';
      if (token) {
        window.localStorage.setItem('spotify_token', token);
        setAccessToken(token);
      }
    } else {
      setAccessToken(token);
    }
  }, []);

  // Function to handle Spotify login
  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
  };

  const fetchSongs = async () => {
    const response = await fetch('https://customerservice-mf18.onrender.com/api/songs');
    const data = await response.json();
    setSongList(data);
  };

  const handleSongChange = (e) => {
    setSong(e.target.value);
  };

  // Search song on Spotify and add it to the queue
  const searchAndQueueSong = async (songName) => {
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const searchData = await searchRes.json();
    const trackUri = searchData.tracks.items[0]?.uri;

    if (trackUri) {
      // Add song to the queue on Spotify
      await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (song.trim()) {
      searchAndQueueSong(song); // Add song to Spotify queue
      const newSong = { songName: song }; // Add the song to the local list (not from API)
      setSongList([newSong, ...songList]);
      setSong('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`https://customerservice-mf18.onrender.com/api/songs/${id}`, {
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

      {/* Spotify Login Button */}
      {!accessToken ? (
        <button
          onClick={handleLogin}
          className="mb-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
        >
          Log in to Spotify
        </button>
      ) : (
        <p className="text-green-600 mb-6">Logged in to Spotify!</p>
      )}

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

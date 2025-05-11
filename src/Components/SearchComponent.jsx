import { useState } from 'react';
import axios from 'axios';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const search = async () => {
        const res = await axios.post('http://localhost:3001/search', { query });
        setResults(res.data);
    };

    const addToQueue = async (song) => {
        await axios.post('http://localhost:3001/queue', { song });
        alert(`"${song.name}" added to queue!`);
    };

    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for a song" />
            <button onClick={search}>Search</button>
            <ul>
                {results.map(song => (
                    <li key={song.id}>
                        {song.name} by {song.artists[0].name}
                        <button onClick={() => addToQueue(song)}>Queue</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchComponent;

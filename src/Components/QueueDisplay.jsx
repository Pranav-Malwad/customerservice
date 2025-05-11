import { useEffect, useState } from 'react';
import axios from 'axios';

function QueueDisplay() {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await axios.get('http://localhost:3001/queue');
            setQueue(res.data);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Now Playing Queue</h2>
            <ol>
                {queue.map((song, i) => (
                    <li key={i}>{song.name} - {song.artists[0].name}</li>
                ))}
            </ol>
        </div>
    );
}

export default QueueDisplay;

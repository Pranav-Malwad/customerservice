
import React, { useState, useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";

const YouTubeJukebox = () => {
  const [queue, setQueue] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const playerRef = useRef(null);
  const hasFetchedQueue = useRef(false);
  // const apiKey = "AIzaSyD4JOPyolbdNqLP5RoHa--R2Jmx-vsTskY";
  const apiKey = "AIzaSyAzyi3FBslW4h86guVXCCDg2Q_AW1jAUek";

  // Fetch the queue from the server on load
  const fetchQueue = async () => {
    try {
      const response = await fetch("https://customerservice-mf18.onrender.com/api/get-queue");
      const data = await response.json();
      setQueue(data.queue);
      if (data.queue.length > 0) {
        setCurrentVideo(data.queue[0].videoId);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  // Setup the YouTube player
  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  // const onPlayerStateChange = (event) => {
  //   if (event.data === window.YT.PlayerState.ENDED) {
  //     setQueue((prev) => {
  //       const newQueue = [...prev];
  //       newQueue.shift();
  //       const nextVideo = newQueue[0]?.videoId || null;
  //       setCurrentVideo(nextVideo);
  //       return newQueue;
  //     });

  //     if (queue.length > 0) {
  //       const finishedVideo = queue[0];
  //       fetch(`https://customerservice-mf18.onrender.com/api/delete-song/${finishedVideo.videoId}`, {
  //         method: "DELETE",
  //       }).catch((error) =>
  //         console.error("Error deleting finished song from queue:", error)
  //       );
  //     }
      
  //   }
  // };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;
  
        const finishedVideo = prevQueue[0];
        const updatedQueue = prevQueue.slice(1);
        const nextVideoId = updatedQueue[0]?.videoId || null;
  
        // Update current video
        setCurrentVideo(nextVideoId);
  
        // Delete from server
        fetch(`https://customerservice-mf18.onrender.com/api/delete-song/${finishedVideo.videoId}`, {
          method: "DELETE",
        }).catch((error) =>
          console.error("Error deleting finished song from queue:", error)
        );
  
        return updatedQueue;
      });
    }
  };
  

  // Initialize player and queue
  useEffect(() => {
    if (!hasFetchedQueue.current) {
      hasFetchedQueue.current = true;
      fetchQueue();
    }

    const loadPlayer = () => {
      if (currentVideo) {
        playerRef.current = new window.YT.Player("yt-player", {
          height: "390",
          width: "640",
          videoId: currentVideo,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    const loadYTScript = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = loadPlayer;
      } else {
        loadPlayer();
      }
    };

    loadYTScript();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [currentVideo]);

  // useEffect(() => {
  //   if (currentVideo && playerRef.current) {
  //     playerRef.current.loadVideoById(currentVideo);
  //   }
  // }, [currentVideo]);

  useEffect(() => {
  if (
    currentVideo &&
    playerRef.current &&
    typeof playerRef.current.loadVideoById === "function"
  ) {
    playerRef.current.loadVideoById(currentVideo);
  }
}, [currentVideo]);


  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=5&key=${apiKey}`
    );
    const data = await response.json();
    const suggestions = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.default?.url || "",
    }));
    setSuggestions(suggestions);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => fetchSuggestions(value), 300));
  };

  const addToQueue = async (video) => {
    try {
      const alreadyInQueue = queue.some((v) => v.id === video.id);
      if (alreadyInQueue) return;

      await fetch("https://customerservice-mf18.onrender.com/api/add-to-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
        }),
      });

      setQueue((prev) => [...prev, video]);
      setSuggestions([]);
      setSearchTerm("");
      if (!currentVideo) {
        setCurrentVideo(video.id);
      }
    } catch (error) {
      console.error("Error adding song to queue:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl font-semibold text-center mb-5">
        YouTube Music Jukebox
      </h2>

      <div className="relative flex justify-center mb-5">
        <input
          type="text"
          className="border-2 border-gray-300 p-2 w-full md:w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search a song"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full md:w-1/2 bg-white border border-gray-300 rounded-md shadow-md z-10">
            {suggestions.map((video, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center justify-between"
                onClick={() => addToQueue(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-12 h-8 object-cover rounded mr-3"
                />
                {video.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <div id="yt-player" className="mx-auto mb-5 rounded-lg shadow-lg"></div> */}

      <div className="relative pb-[56.25%] h-0 mb-5 rounded-lg shadow-lg">
  <div id="yt-player" className="absolute top-0 left-0 w-full h-full"></div>
</div>


      <div className="queue-section">
        <h4 className="text-2xl font-medium mb-3">Upcoming Queue</h4>
        <ul className="space-y-2">
          {queue.slice(1).map((video, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <span className="text-lg">{video.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-5">
        {queue.length === 0 && (
          <p className="text-gray-500">No songs in queue</p>
        )}
      </div>
    </div>
  );
};

export default YouTubeJukebox;


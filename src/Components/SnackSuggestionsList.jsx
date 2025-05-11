import { useEffect, useState } from "react";

export default function SnackSuggestionsList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("https://customerservice-mf18.onrender.com/api/snack-suggestions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use your auth method
        },
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError("Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSuggestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this suggestion?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`https://customerservice-mf18.onrender.com/api/snack-suggestions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setSuggestions(suggestions.filter((s) => s._id !== id));
      } else {
        alert("Failed to delete suggestion.");
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading suggestions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        🍴 Snack Suggestions
      </h2>
      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500">No suggestions found.</p>
      ) : (
        <ul className="space-y-4">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{suggestion.snack}</p>
                <p className="text-sm text-gray-500">
                  {new Date(suggestion.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteSuggestion(suggestion._id)}
                disabled={deletingId === suggestion._id}
                className={`px-3 py-1 rounded text-sm text-white ${
                  deletingId === suggestion._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {deletingId === suggestion._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

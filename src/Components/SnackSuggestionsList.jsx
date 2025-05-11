import { useEffect, useState } from "react";

export default function SnackSuggestionsList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const predefinedSnacks = ["magie", "pasta"];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const suggestionsPerPage = 5;

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("https://customerservice-mf18.onrender.com/api/snack-suggestions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        setSuggestions((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert("Failed to delete suggestion.");
      }
    } catch {
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

  // Grouping
  const snackCounts = predefinedSnacks.reduce((acc, snack) => {
    acc[snack] = suggestions.filter((s) => s.snack.toLowerCase() === snack).length;
    return acc;
  }, {});

  const otherSuggestions = suggestions.filter(
    (s) => !predefinedSnacks.includes(s.snack.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * suggestionsPerPage;
  const indexOfFirst = indexOfLast - suggestionsPerPage;
  const currentSuggestions = otherSuggestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(otherSuggestions.length / suggestionsPerPage);

  return (
  <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] shadow-xl rounded-2xl">

  <h2 className="text-2xl font-bold mb-6 text-center text-[#065f46]">🍴 Snack Suggestions</h2>

  {/* Popular Snacks */}
  <div className="mb-8">
  <h3 className="text-2xl font-semibold text-[#065f46] mb-4">Popular Snacks</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {predefinedSnacks.map((snack) => (
        <div
          key={snack}
           className="flex justify-between items-center bg-white border border-[#a7f3d0] p-4 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <span className="text-lg font-medium capitalize text-gray-700">{snack}</span>
          <span className="text-sm font-semibold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
            {snackCounts[snack]}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Other Suggestions */}
  <div>
<h3 className="text-2xl font-semibold text-[#065f46] mb-4">Other Suggestions</h3>

    {otherSuggestions.length === 0 ? (
      <p className="text-gray-500">No other suggestions found.</p>
    ) : (
      <>
        <ul className="space-y-4">
          {currentSuggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              className="flex flex-col sm:flex-row justify-between items-center bg-white border border-[#a7f3d0] p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-800">{suggestion.snack}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(suggestion.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteSuggestion(suggestion._id)}
                disabled={deletingId === suggestion._id}
                className={`mt-4 sm:mt-0 sm:ml-4 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition ${
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

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
</div>

  );
}

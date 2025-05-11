import { useEffect, useState } from "react";

export default function SnackPollModal() {
  const [showModal, setShowModal] = useState(true);
  const [snack, setSnack] = useState("");
  const [otherSnack, setOtherSnack] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // <-- New state

  const handleSubmit = async () => {
    const selectedSnack = snack === "other" ? otherSnack : snack;
    if (!selectedSnack.trim()) return setStatus("Please enter a valid snack.");

    setLoading(true); // Start loading

    try {
      const res = await fetch("https://customerservice-mf18.onrender.com/api/snackpoll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snack: selectedSnack }),
      });

      if (res.ok) {
        setStatus("Thank you for sharing your preference!");
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setStatus("Error submitting response.");
      }
    } catch (err) {
      setStatus("Server error.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSkip = () => setShowModal(false);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          🌧️ Which monsoon snack would you prefer to see added?
        </h3>

        <select
          value={snack}
          onChange={(e) => setSnack(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="">Select a snack</option>
          <option value="maggie">Maggie</option>
          <option value="pasta">Pasta</option>
          <option value="other">Other</option>
        </select>

        {snack === "other" && (
          <input
            type="text"
            placeholder="Type your preferred snack"
            value={otherSnack}
            onChange={(e) => setOtherSnack(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-2 border-2 rounded text-gray-600 hover:text-gray-800"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {status && (
          <p className="text-sm mt-4 text-center text-green-600 mb-2">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

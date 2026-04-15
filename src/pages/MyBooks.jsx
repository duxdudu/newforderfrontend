import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function MyBooks() {
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Load borrowed books when page opens
  useEffect(() => {
    fetchMyBooks();
  }, []);

  async function fetchMyBooks() {
    try {
      const res = await fetch("http://localhost:5000/api/my-books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBorrows(data);
    } catch (err) {
      setMessage("Failed to load your books.");
    } finally {
      setLoading(false);
    }
  }

  // Return a borrowed book
  async function handleReturn(bookId) {
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });
      const data = await res.json();
      setMessage(data.message);
      // Refresh the list after returning
      fetchMyBooks();
    } catch (err) {
      setMessage("Failed to return book.");
    }
  }

  // Format date to a readable string
  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📋 My Borrowed Books</h1>

        {message && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded">
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : borrows.length === 0 ? (
          <p className="text-gray-500">You haven't borrowed any books yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Borrowed On</th>
                  <th className="px-4 py-3 text-left">Returned On</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((item) => (
                  <tr key={item.borrow_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3">{item.author}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{formatDate(item.borrow_date)}</td>
                    <td className="px-4 py-3">{formatDate(item.return_date)}</td>
                    <td className="px-4 py-3">
                      {/* Only show Return button if book hasn't been returned yet */}
                      {!item.return_date ? (
                        <button
                          onClick={() => handleReturn(item.book_id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-green-600 text-xs font-medium">Returned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBooks;

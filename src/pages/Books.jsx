import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Books() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch all books when the page loads
  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const res = await fetch("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setMessage("Failed to load books.");
    } finally {
      setLoading(false);
    }
  }

  // Borrow a book by its ID
  async function handleBorrow(bookId) {
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });
      const data = await res.json();
      setMessage(data.message);
      // Refresh book list to show updated quantity
      fetchBooks();
    } catch (err) {
      setMessage("Failed to borrow book.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📖 All Books</h1>

        {message && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded">
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No books available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Available</th>
                  {/* Only show Borrow button for regular users */}
                  {user.role === "user" && <th className="px-4 py-3 text-left">Action</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">{book.category}</td>
                    <td className="px-4 py-3">{book.quantity}</td>
                    {user.role === "user" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleBorrow(book.id)}
                          disabled={book.quantity <= 0}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Borrow
                        </button>
                      </td>
                    )}
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

export default Books;

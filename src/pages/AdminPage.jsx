import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Empty form state — reused for both add and edit
const emptyForm = { title: "", author: "", category: "", quantity: "" };

function AdminPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding, number = editing
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

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

  // Handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit form — either add or update depending on editingId
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const url = editingId
      ? `http://localhost:5000/api/books/${editingId}`
      : "http://localhost:5000/api/books";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
      setForm(emptyForm);
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      setMessage("Failed to save book.");
    }
  }

  // Fill the form with the selected book's data for editing
  function handleEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity,
    });
    setMessage("");
  }

  // Cancel editing and reset form
  function handleCancel() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message);
      fetchBooks();
    } catch (err) {
      setMessage("Failed to delete book.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">🛠️ Admin — Manage Books</h1>

        {message && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded">
            {message}
          </p>
        )}

        {/* Add / Edit Book Form */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "✏️ Edit Book" : "➕ Add New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Book title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Fiction, Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Number of copies"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 text-sm"
              >
                {editingId ? "Update Book" : "Add Book"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Books Table */}
        {loading ? (
          <p className="text-gray-500">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No books yet. Add one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">{book.category}</td>
                    <td className="px-4 py-3">{book.quantity}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
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

export default AdminPage;

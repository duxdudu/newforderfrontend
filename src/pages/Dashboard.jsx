import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Dashboard() {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome, {user.name}! 👋
        </h1>
        <p className="text-gray-600 mb-8">
          You are logged in as <span className="font-semibold">{user.role}</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* All users can browse books */}
          <Link
            to="/books"
            className="bg-white rounded shadow p-6 hover:shadow-md transition text-center"
          >
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-lg font-semibold text-blue-700">Browse Books</h2>
            <p className="text-sm text-gray-500 mt-1">View all available books and borrow them.</p>
          </Link>

          {/* Only regular users see My Borrowed Books */}
          {user.role === "user" && (
            <Link
              to="/my-books"
              className="bg-white rounded shadow p-6 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">📋</div>
              <h2 className="text-lg font-semibold text-blue-700">My Borrowed Books</h2>
              <p className="text-sm text-gray-500 mt-1">See books you've borrowed and return them.</p>
            </Link>
          )}

          {/* Only admins see the Admin Panel */}
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="bg-white rounded shadow p-6 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">🛠️</div>
              <h2 className="text-lg font-semibold text-blue-700">Admin Panel</h2>
              <p className="text-sm text-gray-500 mt-1">Add, edit, or delete books in the library.</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

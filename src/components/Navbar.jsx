import { Link, useNavigate } from "react-router-dom";

// Top navigation bar shown on all protected pages
function Navbar() {
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Log out: clear storage and go to login page
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <span className="font-bold text-lg">📚 LibraryApp</span>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/books" className="hover:underline">Books</Link>
        {/* Only show My Books link for regular users */}
        {user.role === "user" && (
          <Link to="/my-books" className="hover:underline">My Borrowed Books</Link>
        )}
        {/* Only show Admin link for admins */}
        {user.role === "admin" && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Hello, {user.name} ({user.role})</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-3 py-1 rounded text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

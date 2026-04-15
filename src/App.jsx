import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import MyBooks from "./pages/MyBooks";
import AdminPage from "./pages/AdminPage";

// Helper: check if user is logged in by looking at localStorage
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Protected route — redirects to login if not authenticated
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
      <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;

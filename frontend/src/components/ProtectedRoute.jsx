// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const roomCode = localStorage.getItem("roomCode");
  const userName = localStorage.getItem("userName");

  if (!roomCode || !userName) return <Navigate to="/" />;

  return children;
}

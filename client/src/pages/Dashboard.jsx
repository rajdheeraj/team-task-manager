import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/tasks/stats");
      setStats(data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!stats) return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <h2>Dashboard</h2>

      <p>
        Welcome, <strong>{user?.name}</strong>! Role: <strong>{user?.role}</strong>
      </p>

      {/* 🔥 Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "20px 0" }}>
        <div style={{ border: "1px solid #ccc", padding: 16 }}>
          Total Tasks: {stats.total}
        </div>

        <div style={{ border: "1px solid #ccc", padding: 16 }}>
          Todo: {stats.todo}
        </div>

        <div style={{ border: "1px solid #ccc", padding: 16 }}>
          In Progress: {stats.inProgress}
        </div>

        <div style={{ border: "1px solid #ccc", padding: 16 }}>
          Done: {stats.done}
        </div>

        <div style={{ border: "1px solid red", padding: 16, color: "red" }}>
          Overdue: {stats.overdue}
        </div>
      </div>

      <nav style={{ display: "flex", gap: 16 }}>
        <button onClick={() => navigate("/projects")}>Projects</button>
        <button onClick={() => navigate("/tasks")}>My Tasks</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Dashboard;
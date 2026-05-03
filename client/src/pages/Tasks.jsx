import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    project: "",
    dueDate: "",
  });

  // ================= FETCH DATA =================
  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch {}
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "admin") {
      fetchUsers();
      fetchProjects();
    }
  }, []);

  // ================= CREATE TASK =================
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/tasks", form);

      setForm({
        title: "",
        description: "",
        assignedTo: "",
        project: "",
        dueDate: "",
      });

      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch {
      setError("Failed to update status");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <button onClick={() => navigate("/")}>← Back</button>
      <h2>Tasks</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= CREATE TASK ================= */}
      {user?.role === "admin" && (
        <form
          onSubmit={handleCreate}
          style={{
            marginBottom: 30,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#f9f9f9",
          }}
        >
          <h3>Create Task</h3>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 10, padding: 10 }}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            style={{ width: "100%", marginBottom: 10, padding: 10 }}
          />

          <select
            value={form.assignedTo}
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 10, padding: 10 }}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={form.project}
            onChange={(e) =>
              setForm({ ...form, project: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 10, padding: 10 }}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
            style={{ width: "100%", marginBottom: 10, padding: 10 }}
          />

          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Create Task
          </button>
        </form>
      )}

      {/* ================= TASK LIST ================= */}
      {tasks.length === 0 && <p>No tasks found.</p>}

      {tasks.map((t) => (
        <div
          key={t._id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
            background: "#fafafa",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: 8 }}>{t.title}</h3>
          <p style={{ marginBottom: 6 }}>{t.description}</p>

          <p>
            <strong>Assigned:</strong>{" "}
            {t.assignedTo?.name || "Unassigned"}
          </p>

          <p>
            <strong>Project:</strong> {t.project?.name}
          </p>

          <p>
            <strong>Due:</strong>{" "}
            {t.dueDate
              ? new Date(t.dueDate).toLocaleDateString()
              : "No due date"}
          </p>

          <p>
            <strong>Status:</strong> {t.status}
          </p>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {["todo", "in-progress", "done"].map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(t._id, s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  background:
                    t.status === s
                      ? s === "done"
                        ? "green"
                        : s === "in-progress"
                        ? "orange"
                        : "black"
                      : "#eee",
                  color: t.status === s ? "#fff" : "#000",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
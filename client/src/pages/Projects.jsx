import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    }
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // ================= CREATE PROJECT =================
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", {
        name,
        members: selectedMembers,
      });

      setName("");
      setSelectedMembers([]);

      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <button onClick={() => navigate("/")}>← Back</button>

      <h2 style={{ marginBottom: 20 }}>Projects</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= CREATE PROJECT ================= */}
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
          <h3>Create Project</h3>

          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />

          {/* 🔥 MEMBER SELECT */}
          <select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              height: 100,
            }}
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>
      )}

      {/* ================= PROJECT LIST ================= */}
      {projects.length === 0 && <p>No projects found.</p>}

      {projects.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 12,
            borderRadius: 6,
            background: "#fafafa",
          }}
        >
          <h3>{p.name}</h3>
          <p>
            <strong>Created by:</strong> {p.createdBy?.name}
          </p>
          <p>
            <strong>Members:</strong>{" "}
            {p.members?.map((m) => m.name).join(", ") || "None"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Projects;
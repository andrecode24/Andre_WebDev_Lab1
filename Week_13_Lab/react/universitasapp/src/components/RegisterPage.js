import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    password_confirmation: "",
  });

  const navigate = useNavigate();

  // 🔹 Ambil daftar major dari Django API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/majors/")
      .then((response) => setMajors(response.data))
      .catch((error) => console.error("Error fetching majors:", error));
  }, []);

  // 🔹 Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    axios
      .post("http://localhost:8000/api/auth/register/", {
        ...formData,
        major: selectedMajor,
        role: role,
      })
      .then(() => {
        alert("✅ Akun berhasil dibuat!");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Register failed:", err.response?.data || err.message);
        setError(
          "Registrasi gagal: " +
            JSON.stringify(err.response?.data || err.message)
        );
      })
      .finally(() => setLoading(false));
  };

  return (
  <div className="d-flex justify-content-center align-items-center vh-100 page-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "32rem", borderRadius: "20px" }}
      >
        <h3 className="text-center text-primary fw-bold mb-4">
          Register Akun
        </h3>

        {/* 🔹 Alert error tampil di atas form */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan nama lengkap"
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
            />
          </div>

          {/* Major & Role */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Major</label>
              <select
                className="form-select"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                required
              >
                <option value="">Pilih jurusan</option>
                {majors.length > 0 ? (
                  majors.map((major) => (
                    <option key={major.value} value={major.value}>
                      {major.label}
                    </option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Ulangi password"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold mt-2"
            disabled={loading}
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>

        {/* 🔹 Tombol Login */}
        <div className="text-center mt-3">
          <span className="text-muted">Sudah punya akun? </span>
          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => navigate("/login")}
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/service";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      if (user.role?.toLowerCase() === "student") {
        navigate("/student-dashboard");
      } else if (user.role?.toLowerCase() === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        setError("Role tidak dikenali.");
      }
    } catch {
      setError("Login gagal. Periksa email dan password Anda.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "student") {
        navigate("/student-dashboard", { replace: true });
      } else if (role === "instructor") {
        navigate("/instructor-dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
  <div className="d-flex justify-content-center align-items-center vh-100 page-dark-full">
      <div className="card shadow p-4" style={{ width: "25rem", borderRadius: "16px" }}>
        <h3 className="text-center text-primary mb-4 fw-bold">Login</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <span>Belum punya akun? </span>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-link p-0 text-decoration-none"
          >
            Daftar di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

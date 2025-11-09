import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getInstructorGrades,
  getStudents,
  createGrade,
} from "../services/service";

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [gradeForm, setGradeForm] = useState({ student: "", course: "", score: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Ambil token & role dari localStorage
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    // Jika tidak ada token atau role bukan instructor → redirect ke login
    if (!token || role !== "instructor") {
      window.location.href = "/login";
      return;
    }

    // Ambil data user lainnya
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const full_name = localStorage.getItem("full_name");
    const major = localStorage.getItem("major");

    setUser({ email, username, full_name, major, role });

    // Fetch grades assigned by this instructor
    getInstructorGrades()
      .then((data) => setGrades(data))
      .catch(() => setGrades([]))
      .finally(() => setLoadingGrades(false));

    // Fetch list of eligible students
    getStudents()
      .then((data) => setStudents(data))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, []);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!gradeForm.student || !gradeForm.course || !gradeForm.score) {
      setFormError("Lengkapi semua field sebelum menyimpan.");
      return;
    }

    setSubmitting(true);
    try {
      const newGrade = await createGrade({
        student: gradeForm.student,
        course: gradeForm.course,
        score: gradeForm.score,
      });
      setGrades((prev) => [newGrade, ...prev]);
      setGradeForm({ student: "", course: "", score: "" });
    } catch (error) {
      console.error("Failed to create grade", error.response?.data || error.message);
      setFormError("Gagal menyimpan nilai. Pastikan datanya benar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Hapus semua data user dan token
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("major");
    localStorage.removeItem("role");

    // Redirect ke login
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 page-warning">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 page-warning">
      <div className="card shadow-lg p-4" style={{ width: "36rem", borderRadius: "16px" }}>
        <h3 className="text-center text-warning mb-4 fw-bold">Instructor Dashboard</h3>

        <div className="mb-3">
          <p className="mb-1">
            <strong>Full Name:</strong> {user.full_name}
          </p>
          <p className="mb-1">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-1">
            <strong>Major:</strong> {user.major}
          </p>
          <p className="text-primary fw-semibold mt-3">
            Role: {user.role.toUpperCase()}
          </p>
        </div>

        {/* Grade Input Section */}
        <div className="mt-4">
          <h5 className="fw-bold">Input Nilai Mahasiswa</h5>
          <form onSubmit={handleGradeSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label fw-semibold">Mahasiswa</label>
              <select
                className="form-select"
                value={gradeForm.student}
                onChange={(e) => setGradeForm({ ...gradeForm, student: e.target.value })}
                disabled={loadingStudents || submitting || students.length === 0}
                required
              >
                <option value="">
                  {loadingStudents ? "Memuat mahasiswa..." : "Pilih mahasiswa"}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mata Kuliah</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: WebBasedDevelopment"
                value={gradeForm.course}
                onChange={(e) => setGradeForm({ ...gradeForm, course: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nilai</label>
              <input
                type="number"
                className="form-control"
                placeholder="0 - 100"
                min="0"
                max="100"
                step="0.01"
                value={gradeForm.score}
                onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                required
              />
            </div>

            {formError && (
              <div className="alert alert-danger py-2" role="alert">
                {formError}
              </div>
            )}

            <button type="submit" className="btn btn-warning fw-semibold w-100" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Nilai"}
            </button>
          </form>
        </div>

        {/* Grades Section */}
        <div className="mt-4">
          <h5 className="fw-bold">Nilai Mahasiswa</h5>
          {loadingGrades ? (
            <div className="text-muted">Memuat nilai...</div>
          ) : grades.length === 0 ? (
            <div className="text-muted">Belum ada nilai yang Anda input.</div>
          ) : (
            <ul className="list-group">
              {grades.map((g) => (
                <li key={g.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{g.course} — {g.student_name}</div>
                    <small className="text-muted">{g.student_email}</small>
                  </div>
                  <span className="badge bg-warning text-dark rounded-pill">{g.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-danger w-100 fw-semibold mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default InstructorDashboard;

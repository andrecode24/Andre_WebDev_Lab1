import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/";

// 🔹 LOGIN
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login/`, {
      email,
      password,
    });

    const data = response.data;

    // Deteksi struktur token
    const token = data.token
      ? data.token
      : { access: data.access, refresh: data.refresh };

    // Ambil user info dari response
    const {
      email: userEmail,
      username,
      full_name,
      major,
      role,
    } = data;

    // Simpan token dan data user ke localStorage
    if (token?.access) {
      localStorage.setItem("access_token", token.access);
      localStorage.setItem("refresh_token", token.refresh);
      localStorage.setItem("email", userEmail); // ✅ perbaikan di sini
      localStorage.setItem("username", username);
      localStorage.setItem("full_name", full_name);
      localStorage.setItem("major", major);
      localStorage.setItem("role", role);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token.access}`;
    }

    return { userEmail, username, full_name, major, role };
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 REGISTER
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register/`, userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("full_name");
  localStorage.removeItem("major");
  localStorage.removeItem("role");

  delete axios.defaults.headers.common["Authorization"];
};

// dY"1 NILAI (Grades)
export const getStudentGrades = async () => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_URL}nilai/student/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getInstructorGrades = async () => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_URL}nilai/instructor/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createGrade = async ({ student, course, score }) => {
  const token = localStorage.getItem("access_token");
  const res = await axios.post(
    `${API_URL}nilai/instructor/`,
    { student, course, score },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getStudents = async () => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_URL}students/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

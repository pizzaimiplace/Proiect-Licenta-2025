import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Form from "../components/Form";
import Api from "../Api";
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async ({ username, password }) => {
    try {
      await Api.post("/api/register/", { username, password });
      const res = await Api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      setError("");
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="register-container">
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <Form isRegistering={true} onSubmit={handleRegister} />
        <div className="error-msg">
                {error && "Incorrect username or password."}
        </div>
    </div>
  );
}

export default Register;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Form from "../components/Form";
import Api from "../Api";
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async ({ username, password }) => {
    try {
      const res = await Api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="login-container">
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <Form isRegistering={false} onSubmit={handleLogin} />
        <div className="error-msg">
            {error && "Incorrect username or password."}
        </div>
    </div>
  );
}

export default Login;
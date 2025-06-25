import { useState } from "react";
import './Form.css'

export default function Form({ isRegistering = false, onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Username</label>
            <input name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} required />
        </div>

      <button type="submit">{isRegistering ? "Register" : "Login"}</button>
    </form>
  );
}

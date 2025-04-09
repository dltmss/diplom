// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Аты-жөні:", name);
    console.log("Email:", email);
    console.log("Құпия сөз:", password);
    // Мұнда API арқылы тіркеу логикасын қоса аласың
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <h2>Тіркелу</h2>
        <input
          type="text"
          placeholder="Аты-жөні"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Құпия сөз"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Тіркелу</button>

        {/* Кіру бетіне сілтеме */}
        <Link to="/">Кіру бетіне өту</Link>
      </form>
    </div>
  );
};

export default Register;

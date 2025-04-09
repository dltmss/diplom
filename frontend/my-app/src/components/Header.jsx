import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "1rem", background: "#f5f5f5" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Басты бет</Link>
        <Link to="/dashboard">Аналитика</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/login">Кіру</Link>
        <Link to="/register">Тіркелу</Link>
      </nav>
    </header>
  );
};

export default Header;

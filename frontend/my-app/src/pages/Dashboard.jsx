import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Басқару беті</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <div className="text-3xl font-bold text-blue-500 p-4">
          Tailwind работает! 🚀
        </div>
        <p>Бұл бөлімде аналитикалық деректер көрсетіледі</p>
      </header>

      <section className="dashboard-metrics">
        <div className="metric-card">
          <h2>Пайдаланушылар</h2>
          <p>145</p>
        </div>
        <div className="metric-card">
          <h2>Сұраныстар</h2>
          <p>312</p>
        </div>
        <div className="metric-card">
          <h2>Жауап беру уақыты</h2>
          <p>0.84 сек</p>
        </div>
      </section>

      <section className="dashboard-graph">
        <h2>Деректер графигі</h2>
        <div className="graph-placeholder">[Мұнда график болады]</div>
      </section>
    </div>
  );
};

export default Dashboard;

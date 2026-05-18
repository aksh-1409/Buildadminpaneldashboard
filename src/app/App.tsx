import React from "react";
import Dashboard from "./components/Dashboard";

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

export default function App() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      background: "#0a0e27",
      overflow: "hidden",
      fontFamily: FONT,
    }}>
      <Dashboard />
    </div>
  );
}

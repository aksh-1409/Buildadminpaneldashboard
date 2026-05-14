import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import { PanelLeftClose, PanelLeftOpen, Bell } from "lucide-react";

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const C = {
  bg: "#0d1117",
  topbar: "#0f1420",
  border: "rgba(255,255,255,0.08)",
  teal: "#0097a7",
  cyan: "#00d9ff",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  green: "#22c55e",
};

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  attendance: "Attendance",
  reports: "Reports",
  courses: "Courses",
  faculty: "Faculty",
  data: "Data Export",
};

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: C.bg,
      overflow: "hidden",
      fontFamily: FONT,
    }}>
      {/* Sidebar */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Topbar */}
        <div style={{
          height: 52,
          background: C.topbar,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          flexShrink: 0,
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: 30, height: 30, borderRadius: 6,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.textMuted,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT }}>Admin</span>
            <span style={{ color: C.textMuted, fontSize: 13 }}>/</span>
            <span style={{ color: C.textPrimary, fontSize: 13, fontWeight: 500, fontFamily: FONT }}>
              {SECTION_LABELS[activeSection]}
            </span>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
            <span style={{ color: C.green, fontSize: 12, fontFamily: FONT }}>Live</span>
          </div>

          {/* Notification bell */}
          <button
            style={{
              position: "relative",
              width: 30, height: 30, borderRadius: 6,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.textMuted,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Bell size={14} />
            <div style={{
              position: "absolute", top: 7, right: 7,
              width: 6, height: 6, borderRadius: "50%",
              background: "#ef4444",
            }} />
          </button>

          {/* Admin user */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: C.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: FONT }}>A</span>
            </div>
            <span style={{ color: C.textPrimary, fontSize: 13, fontFamily: FONT }}>Admin User</span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection !== "dashboard" && (
            <PlaceholderSection name={SECTION_LABELS[activeSection]} />
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ name }: { name: string }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 16, padding: 40, background: C.bg,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 14,
        background: "rgba(0,151,167,0.1)",
        border: `1px solid rgba(0,151,167,0.25)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: C.teal, fontSize: 22, fontWeight: 700, fontFamily: FONT }}>{name[0]}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: C.textPrimary, fontFamily: FONT, fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
          {name}
        </p>
        <p style={{ color: C.textMuted, fontSize: 13, margin: 0, fontFamily: FONT }}>
          This section connects to your existing backend endpoints.
        </p>
        <p style={{ color: C.textMuted, fontSize: 12, margin: "6px 0 0", fontFamily: "'Courier New', monospace" }}>
          /api/{name.toLowerCase().replace(" ", "-")}
        </p>
      </div>
      <div style={{
        padding: "9px 22px",
        border: `1px solid rgba(0,151,167,0.3)`,
        borderRadius: 7,
        background: "rgba(0,151,167,0.08)",
        color: C.teal,
        fontFamily: FONT,
        fontSize: 13, fontWeight: 500,
      }}>
        Coming Soon
      </div>
    </div>
  );
}

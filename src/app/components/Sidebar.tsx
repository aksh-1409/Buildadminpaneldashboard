import React, { useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, BarChart3,
  Settings, Bell, LogOut, BookOpen, UserCheck, Database,
} from "lucide-react";

const C = {
  bg: "#0f1420",
  activeBg: "#0097a7",
  hoverBg: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.08)",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  teal: "#0097a7",
  green: "#22c55e",
};

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "students", icon: Users, label: "Students" },
  { id: "attendance", icon: CalendarCheck, label: "Attendance" },
  { id: "reports", icon: BarChart3, label: "Reports" },
  { id: "courses", icon: BookOpen, label: "Courses" },
  { id: "faculty", icon: UserCheck, label: "Faculty" },
  { id: "data", icon: Database, label: "Data Export" },
];

interface Props {
  activeSection: string;
  onSectionChange: (id: string) => void;
  collapsed: boolean;
}

export default function Sidebar({ activeSection, onSectionChange, collapsed }: Props) {
  const [hovItem, setHovItem] = useState<string | null>(null);

  return (
    <div style={{
      width: collapsed ? 64 : 220,
      height: "100vh",
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
      position: "relative",
      zIndex: 100,
      fontFamily: FONT,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 0" : "20px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        minHeight: 64,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: C.teal,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>A</span>
        </div>
        {!collapsed && (
          <span style={{ color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>Admin Panel</span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const active = activeSection === id;
          const hov = hovItem === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              onMouseEnter={() => setHovItem(id)}
              onMouseLeave={() => setHovItem(null)}
              title={collapsed ? label : undefined}
              style={{
                width: "100%",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 12px",
                marginBottom: 2,
                background: active ? C.activeBg : hov ? C.hoverBg : "transparent",
                borderRadius: 8,
                cursor: "pointer",
                transition: "background 0.15s",
                fontFamily: FONT,
              }}
            >
              <Icon size={16} color={active ? "#fff" : hov ? C.textPrimary : C.textMuted} />
              {!collapsed && (
                <span style={{
                  color: active ? "#fff" : hov ? C.textPrimary : C.textMuted,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  flex: 1,
                  textAlign: "left",
                  transition: "color 0.15s",
                }}>{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${C.border}`, margin: "0 8px" }} />

      {/* Bottom actions */}
      <div style={{ padding: "8px 8px 4px" }}>
        {[
          { id: "notif", icon: Bell, label: "Notifications", badge: 3 },
          { id: "settings", icon: Settings, label: "Settings" },
        ].map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onMouseEnter={() => setHovItem(id)}
            onMouseLeave={() => setHovItem(null)}
            style={{
              width: "100%", border: "none",
              display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              padding: collapsed ? "10px 0" : "10px 12px",
              marginBottom: 2,
              background: hovItem === id ? C.hoverBg : "transparent",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: FONT,
              position: "relative",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Icon size={16} color={hovItem === id ? C.textPrimary : C.textMuted} />
              {badge && (
                <div style={{
                  position: "absolute", top: -2, right: -2,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#ef4444",
                }} />
              )}
            </div>
            {!collapsed && <span style={{ color: C.textMuted, fontSize: 13 }}>{label}</span>}
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        padding: collapsed ? "12px 0" : "12px 16px",
        borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: C.teal,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>AD</span>
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p style={{ color: C.textPrimary, fontSize: 12, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin User</p>
              <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>admin@college.edu</p>
            </div>
            <LogOut size={14} color={C.textMuted} style={{ flexShrink: 0, cursor: "pointer" }} />
          </>
        )}
      </div>

      {/* Connected indicator */}
      {!collapsed && (
        <div style={{
          padding: "8px 16px 14px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
          <span style={{ color: C.green, fontSize: 11 }}>Connected</span>
        </div>
      )}
    </div>
  );
}

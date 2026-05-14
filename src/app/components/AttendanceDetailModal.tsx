import React, { useState } from "react";
import { X, Send, Mail } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  Student, MONTHS,
  generateStudentAttendance, generateMonthlyStudentAttendance,
  getStudentDayPeriods, getStudentWeekDays, getStudentMonthWeeks, getStudentSemesterData,
} from "../data/mockData";

interface Props {
  student: Student | null;
  onClose: () => void;
}

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const C = {
  bg: "#0d1117",
  card: "#131929",
  cardBorder: "rgba(255,255,255,0.08)",
  teal: "#0097a7",
  cyan: "#00d9ff",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  inputBg: "rgba(255,255,255,0.04)",
  rowBorder: "rgba(255,255,255,0.06)",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f59e0b",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a2035", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6, padding: "8px 12px", fontFamily: FONT }}>
        <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || C.cyan, fontSize: 12, margin: "2px 0" }}>
            {p.name}: {p.value}{p.name === "percentage" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AttendanceDetailModal({ student, onClose }: Props) {
  const [view, setView] = useState<"daywise" | "monthwise" | "by-semester" | "by-date" | "by-week" | "by-month">("daywise");
  const [emailDesc, setEmailDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [specificDate, setSpecificDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [specificMonth, setSpecificMonth] = useState(MONTHS[0]);
  const [specificWeek, setSpecificWeek] = useState(1);

  if (!student) return null;

  const dayData = generateStudentAttendance(student);
  const monthData = generateMonthlyStudentAttendance(student);
  const byDateData = getStudentDayPeriods(student, specificDate);
  const byWeekData = getStudentWeekDays(student, specificMonth, specificWeek);
  const byMonthData = getStudentMonthWeeks(student, specificMonth);
  const semesterData = getStudentSemesterData(student);

  const statusColor =
    student.status === "good" ? C.green :
    student.status === "average" ? C.cyan :
    student.status === "at-risk" ? C.orange : C.red;

  const statusLabel =
    student.status === "good" ? "Good Standing" :
    student.status === "average" ? "Average" :
    student.status === "at-risk" ? "At Risk" : "Detained";

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 2000); }, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: "min(420px, 96vw)",
        height: "100vh",
        background: C.card,
        borderLeft: `1px solid ${C.cardBorder}`,
        boxShadow: "-6px 0 30px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${C.cardBorder}`,
        }}>
          <div>
            <p style={{ color: C.textMuted, fontSize: 11, margin: 0, fontFamily: FONT }}>Attendance Detail</p>
            <p style={{ color: C.textPrimary, fontSize: 14, fontWeight: 500, margin: "3px 0 0", fontFamily: FONT }}>
              {student.name}
              <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 400 }}> · {student.rollno}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 6,
              border: `1px solid ${C.cardBorder}`,
              background: "transparent",
              color: C.textMuted,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 20px" }}>
          {/* View Toggle - Row 1 */}
          <div style={{ padding: "14px 20px 0" }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, border: `1px solid ${C.cardBorder}`, marginBottom: 6 }}>
              {([
                { id: "daywise", label: "Day-wise" },
                { id: "monthwise", label: "Month-wise" },
                { id: "by-semester", label: "Semester" },
              ] as const).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  style={{
                    flex: 1, padding: "7px 0",
                    borderRadius: 6, border: "none",
                    background: view === id ? C.teal : "transparent",
                    color: view === id ? "#fff" : C.textMuted,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: FONT,
                    fontWeight: view === id ? 500 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* View Toggle - Row 2 */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, border: `1px solid ${C.cardBorder}` }}>
              {(["by-date", "by-week", "by-month"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    flex: 1, padding: "7px 0",
                    borderRadius: 6, border: "none",
                    background: view === v ? C.teal : "transparent",
                    color: view === v ? "#fff" : C.textMuted,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: FONT,
                    fontWeight: view === v ? 500 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {v === "by-date" ? "By Date" : v === "by-week" ? "By Week" : "By Month"}
                </button>
              ))}
            </div>
          </div>

          {/* Contextual pickers for by-date / by-week / by-month */}
          {(view === "by-date" || view === "by-week" || view === "by-month") && (
            <div style={{ padding: "10px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
              {view === "by-date" && (
                <input
                  type="date"
                  value={specificDate}
                  onChange={e => setSpecificDate(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: 6, color: C.textPrimary,
                    fontFamily: FONT, fontSize: 12,
                    padding: "6px 10px", outline: "none",
                    colorScheme: "dark" as any,
                  }}
                />
              )}
              {(view === "by-week" || view === "by-month") && (
                <select
                  value={specificMonth}
                  onChange={e => setSpecificMonth(e.target.value)}
                  style={{
                    background: "#1a2035", border: `1px solid ${C.cardBorder}`,
                    borderRadius: 6, color: C.textPrimary,
                    fontFamily: FONT, fontSize: 12,
                    padding: "6px 10px", outline: "none", cursor: "pointer",
                  }}
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
              {view === "by-week" && (
                <select
                  value={specificWeek}
                  onChange={e => setSpecificWeek(parseInt(e.target.value))}
                  style={{
                    background: "#1a2035", border: `1px solid ${C.cardBorder}`,
                    borderRadius: 6, color: C.textPrimary,
                    fontFamily: FONT, fontSize: 12,
                    padding: "6px 10px", outline: "none", cursor: "pointer",
                  }}
                >
                  {[1, 2, 3, 4].map(w => <option key={w} value={w}>Week {w}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Chart */}
          <div style={{ padding: "12px 20px 0" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 8,
              padding: "14px 8px 8px",
            }}>
              <ResponsiveContainer width="100%" height={150}>
                {(view === "daywise" || view === "by-date" || view === "by-week") ? (
                  <BarChart
                    data={view === "daywise" ? dayData : view === "by-date" ? byDateData : byWeekData}
                    margin={{ top: 0, right: 4, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.textMuted, fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 1]} ticks={[0, 1]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="present" name="present" fill={C.teal} radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                ) : (
                  <LineChart
                    data={view === "monthwise" ? monthData : view === "by-semester" ? semesterData : byMonthData}
                    margin={{ top: 0, right: 4, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.textMuted, fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="percentage" name="percentage" stroke={C.teal} strokeWidth={2} dot={{ fill: C.teal, r: 3 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: "16px 20px 0" }}>
            {[
              { label: "Total Classes", value: student.total, suffix: "classes" },
              { label: "Present", value: student.present, suffix: "classes" },
              { label: "Absent", value: student.absent, suffix: "classes" },
              { label: "Attendance", value: `${student.percentage}`, suffix: "%" },
            ].map(({ label, value, suffix }) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.rowBorder}`,
                }}
              >
                <span style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT }}>{label}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ color: C.textPrimary, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{value}</span>
                  <span style={{ color: C.textMuted, fontSize: 11, fontFamily: FONT }}>{suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Status Badge */}
          <div style={{ padding: "14px 20px 0" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: `${statusColor}15`,
              border: `1px solid ${statusColor}40`,
              borderRadius: 20, padding: "5px 12px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor }} />
              <span style={{ color: statusColor, fontSize: 12, fontWeight: 500, fontFamily: FONT }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Notify Section */}
          <div style={{ padding: "20px 20px 0" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 8,
              padding: "16px",
            }}>
              <p style={{ color: C.textPrimary, fontSize: 13, fontWeight: 500, margin: "0 0 10px", fontFamily: FONT }}>
                Notify Student
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <Mail size={13} color={C.textMuted} />
                <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT }}>To:</span>
                <span style={{ color: C.cyan, fontSize: 12, fontFamily: FONT }}>{student.email}</span>
              </div>
              <textarea
                placeholder="Write a message..."
                value={emailDesc}
                onChange={(e) => setEmailDesc(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  background: C.inputBg,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 7,
                  color: C.textPrimary,
                  fontSize: 13,
                  fontFamily: FONT,
                  padding: "10px 12px",
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  lineHeight: 1.5,
                  transition: "border-color 0.15s",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = C.cardBorder; }}
              />
              <button
                onClick={handleSend}
                disabled={sending}
                style={{
                  marginTop: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 7,
                  border: "none",
                  background: sent ? C.green : C.teal,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: FONT,
                  cursor: sending ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending ? (
                  <span>Sending...</span>
                ) : sent ? (
                  <span>✓ Sent!</span>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

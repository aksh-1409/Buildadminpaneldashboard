import React, { useState, useMemo } from "react";
import { X, User, ChevronDown } from "lucide-react";
import { Student, mockStudents, BRANCHES } from "../data/mockData";
import AttendanceDetailModal from "./AttendanceDetailModal";

interface Props {
  open: boolean;
  onClose: () => void;
  initialBranch?: string;
  initialThreshold?: string;
  semester?: string;
}

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const C = {
  bg: "#0d1117",
  card: "#131929",
  cardBorder: "rgba(255,255,255,0.08)",
  cardBorderHover: "rgba(255,255,255,0.16)",
  teal: "#0097a7",
  cyan: "#00d9ff",
  cyanDim: "rgba(0,151,167,0.12)",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  inputBg: "rgba(255,255,255,0.04)",
  rowHover: "rgba(255,255,255,0.03)",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f59e0b",
  purple: "#a78bfa",
};

const statusColor = (s: Student["status"]) => ({
  good: C.green, average: C.cyan, "at-risk": C.orange, detained: C.red,
}[s]);

const SelectBox = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 14px",
          background: C.inputBg,
          border: `1px solid ${open ? "rgba(255,255,255,0.18)" : C.cardBorder}`,
          borderRadius: 8, color: C.textPrimary,
          cursor: "pointer", fontSize: 13,
          fontFamily: FONT,
          transition: "border-color 0.15s",
        }}
      >
        <span style={{ color: value ? C.textPrimary : C.textMuted }}>{value || options[0]}</span>
        <ChevronDown size={13} color={C.textMuted} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: "#1a2035",
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 8, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "9px 14px",
                background: value === opt ? C.cyanDim : "transparent",
                border: "none", color: value === opt ? C.cyan : C.textPrimary,
                cursor: "pointer", fontSize: 13,
                fontFamily: FONT,
                transition: "background 0.1s",
                display: "block",
              }}
              onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function StudentListModal({ open, onClose, initialBranch = "ALL BRANCHES", initialThreshold = "ALL STUDENTS", semester = "All" }: Props) {
  const [filterThreshold, setFilterThreshold] = useState(initialThreshold);
  const [filterBranch, setFilterBranch] = useState(initialBranch);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const semNum = semester === "All" ? null : parseInt(semester.replace("Sem ", ""));

  const filtered = useMemo(() => {
    let s = mockStudents.filter(st => semNum === null || st.semester === semNum);
    if (filterBranch !== "ALL BRANCHES") s = s.filter(st => st.branch === filterBranch);
    if (filterThreshold === "ABOVE 75%") s = s.filter(st => st.percentage >= 75);
    else if (filterThreshold === "ABOVE 50%") s = s.filter(st => st.percentage >= 50);
    else if (filterThreshold === "BELOW 50%") s = s.filter(st => st.percentage < 50);
    else if (filterThreshold === "BELOW 30%") s = s.filter(st => st.percentage < 30);
    return s;
  }, [filterThreshold, filterBranch, semNum]);

  const highAttendance = useMemo(() => filtered.filter(s => s.percentage >= 75).slice(0, 7), [filtered]);
  const atRisk = useMemo(() => filtered.filter(s => s.percentage < 60).slice(0, 7), [filtered]);
  const showSplit = filterBranch !== "ALL BRANCHES";

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{
          width: "min(860px, 96vw)",
          maxHeight: "90vh",
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 12,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: FONT,
        }}>
          {/* Modal Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.cardBorder}`,
          }}>
            <span style={{ color: C.textPrimary, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>Student List</span>
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
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ overflowY: "auto", flex: 1, padding: "18px 20px" }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <SelectBox
                value={filterThreshold}
                onChange={setFilterThreshold}
                options={["ALL STUDENTS", "ABOVE 75%", "ABOVE 50%", "BELOW 50%", "BELOW 30%"]}
              />
              <SelectBox
                value={filterBranch}
                onChange={setFilterBranch}
                options={["ALL BRANCHES", ...BRANCHES]}
              />
            </div>

            {!showSplit ? (
              <>
                <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 10, fontFamily: FONT }}>
                  Students <span style={{ color: C.teal, fontWeight: 500 }}>({filtered.length})</span>
                </p>
                <StudentTable students={filtered} onSelect={setSelectedStudent} />
              </>
            ) : (
              <>
                <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 12, fontFamily: FONT }}>
                  {filterBranch} — branch breakdown
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <MiniStudentPanel
                    title={`High Attendance`}
                    students={highAttendance}
                    accentColor={C.green}
                    onSelect={setSelectedStudent}
                  />
                  <MiniStudentPanel
                    title={`At Risk`}
                    students={atRisk}
                    accentColor={C.red}
                    onSelect={setSelectedStudent}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedStudent && (
        <AttendanceDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </>
  );
}

function StudentTable({ students, onSelect }: { students: Student[]; onSelect: (s: Student) => void }) {
  return (
    <div style={{
      border: `1px solid ${C.cardBorder}`,
      borderRadius: 8, overflow: "hidden",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "40px 120px 1fr 80px 70px 70px 90px 90px",
        padding: "8px 14px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: `1px solid ${C.cardBorder}`,
      }}>
        {["", "Roll No", "Name", "Room", "Present", "Absent", "Attend%", "Status"].map((h) => (
          <span key={h} style={{ color: C.textMuted, fontSize: 11, fontWeight: 500, fontFamily: FONT }}>{h}</span>
        ))}
      </div>
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {students.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: C.textMuted, fontSize: 13, fontFamily: FONT }}>
            No students match the selected filters.
          </div>
        ) : (
          students.map((s) => (
            <StudentRow key={s.id} student={s} onClick={() => onSelect(s)} />
          ))
        )}
      </div>
    </div>
  );
}

function StudentRow({ student: s, onClick }: { student: Student; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const sc = statusColor(s.status);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "40px 120px 1fr 80px 70px 70px 90px 90px",
        padding: "9px 14px",
        borderBottom: `1px solid rgba(255,255,255,0.04)`,
        cursor: "pointer",
        background: hov ? C.rowHover : "transparent",
        transition: "background 0.12s",
        alignItems: "center",
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <User size={13} color={C.textMuted} />
      </div>
      <span style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Courier New', monospace" }}>{s.rollno}</span>
      <span style={{ color: C.textPrimary, fontSize: 13, fontFamily: FONT }}>{s.name}</span>
      <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT }}>{s.roomno}</span>
      <span style={{ color: C.green, fontSize: 12, fontWeight: 500, fontFamily: FONT }}>{s.present}</span>
      <span style={{ color: C.red, fontSize: 12, fontWeight: 500, fontFamily: FONT }}>{s.absent}</span>
      <span style={{ color: C.cyan, fontSize: 12, fontWeight: 600, fontFamily: FONT }}>{s.percentage}%</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc, flexShrink: 0 }} />
        <span style={{ color: sc, fontSize: 11, fontFamily: FONT }}>{s.status}</span>
      </div>
    </div>
  );
}

function MiniStudentPanel({ title, students, accentColor, onSelect }: {
  title: string; students: Student[]; accentColor: string; onSelect: (s: Student) => void;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.cardBorder}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${C.cardBorder}`,
        background: `${accentColor}0d`,
      }}>
        <span style={{ color: accentColor, fontSize: 12, fontWeight: 500, fontFamily: FONT }}>{title}</span>
      </div>
      {students.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelect(s)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 14px",
            borderBottom: `1px solid rgba(255,255,255,0.04)`,
            cursor: "pointer",
            transition: "background 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.rowHover}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: `${accentColor}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={12} color={accentColor} />
            </div>
            <span style={{ color: C.textPrimary, fontSize: 12, fontFamily: FONT }}>{s.name}</span>
          </div>
          <span style={{ color: accentColor, fontSize: 12, fontWeight: 600, fontFamily: FONT }}>{s.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

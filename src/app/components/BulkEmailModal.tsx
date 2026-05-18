import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, Mail, Send, Users, AlertTriangle, Star, CheckCircle2, ChevronDown, Filter } from "lucide-react";
import { mockStudents, BRANCHES, SEMESTERS, Student } from "../data/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "at-risk" | "good-attendance";
}

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const C = {
  card: "#131929",
  cardBorder: "rgba(255,255,255,0.08)",
  cyan: "#00d9ff",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  inputBg: "rgba(255,255,255,0.04)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.1)",
  orange: "#f59e0b",
  orangeDim: "rgba(245,158,11,0.1)",
};

const AT_RISK_TEMPLATE =
  `Dear Student,\n\nWe have noticed that your current attendance is below the required threshold. Maintaining good attendance is essential for your academic progress and eligibility for exams.\n\nPlease ensure regular attendance going forward. If you are facing any difficulties, kindly reach out to your class coordinator.\n\nRegards,\nLetsBunk Administration`;

const GOOD_ATTENDANCE_TEMPLATE =
  `Dear Student,\n\nCongratulations! We are pleased to acknowledge your excellent attendance record this semester. Your dedication and commitment to your studies is commendable.\n\nKeep up the great work and continue to inspire your peers!\n\nRegards,\nLetsBunk Administration`;

// Inline dropdown used only inside this modal
function FilterDropdown({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isActive = value !== placeholder;

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 11px",
          background: isActive ? "rgba(255,255,255,0.06)" : C.inputBg,
          border: `1px solid ${isActive ? "rgba(255,255,255,0.18)" : C.cardBorder}`,
          borderRadius: 7, color: isActive ? C.textPrimary : C.textMuted,
          cursor: "pointer", fontFamily: FONT, fontSize: 12,
          transition: "border-color 0.15s",
          whiteSpace: "nowrap" as const,
          overflow: "hidden",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        <ChevronDown size={12} color={C.textMuted} style={{ flexShrink: 0, marginLeft: 4, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 600,
          background: "#1a2035",
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 8, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
          maxHeight: 200, overflowY: "auto",
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left" as const, padding: "8px 12px",
                background: value === opt ? "rgba(0,151,167,0.15)" : "transparent",
                border: "none", color: value === opt ? C.cyan : C.textPrimary,
                cursor: "pointer", fontFamily: FONT, fontSize: 12,
                transition: "background 0.1s", display: "block",
              }}
              onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const AT_RISK_THRESHOLDS = ["Below 60%", "Below 50%", "Below 40%", "Below 30%"];
const GOOD_THRESHOLDS = ["Above 75%", "Above 80%", "Above 85%", "Above 90%"];

function applyThreshold(students: typeof mockStudents, threshold: string, mode: "at-risk" | "good-attendance") {
  if (mode === "at-risk") {
    const cut = parseInt(threshold.replace("Below ", ""));
    return students.filter(s => s.percentage < cut);
  }
  const cut = parseInt(threshold.replace("Above ", ""));
  return students.filter(s => s.percentage >= cut);
}

export default function BulkEmailModal({ open, onClose, mode }: Props) {
  const defaultThreshold = mode === "at-risk" ? "Below 60%" : "Above 75%";
  const [filterBranch, setFilterBranch] = useState("ALL BRANCHES");
  const [filterSemester, setFilterSemester] = useState("All Semesters");
  const [filterThreshold, setFilterThreshold] = useState(defaultThreshold);
  const [message, setMessage] = useState(mode === "at-risk" ? AT_RISK_TEMPLATE : GOOD_ATTENDANCE_TEMPLATE);
  const [subject, setSubject] = useState(
    mode === "at-risk"
      ? "Attendance Warning – Immediate Action Required"
      : "Appreciation – Excellent Attendance Record"
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const semNum = filterSemester === "All Semesters" ? null : parseInt(filterSemester.replace("Sem ", ""));

  const students = useMemo(() => {
    let s = [...mockStudents];
    if (semNum !== null) s = s.filter(st => st.semester === semNum);
    if (filterBranch !== "ALL BRANCHES") s = s.filter(st => st.branch === filterBranch);
    return applyThreshold(s, filterThreshold, mode);
  }, [mode, filterBranch, semNum, filterThreshold]);

  // Auto-select all when filters change
  useEffect(() => {
    setSelectedIds(new Set(students.map(s => s.id)));
  }, [students]);

  const toggleStudent = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map(s => s.id)));
    }
  };

  const handleSend = () => {
    if (selectedIds.size === 0 || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => { setSent(false); onClose(); }, 1800);
    }, 1400);
  };

  const accentColor = mode === "at-risk" ? C.orange : C.green;
  const accentDim = mode === "at-risk" ? C.orangeDim : C.greenDim;
  const ModeIcon = mode === "at-risk" ? AlertTriangle : Star;
  const modeLabel = mode === "at-risk" ? "At-Risk Students" : "High Attendance Students";
  const modeDesc = mode === "at-risk"
    ? `Attendance ${filterThreshold.toLowerCase()}`
    : `Attendance ${filterThreshold.toLowerCase()}`;

  const thresholdOptions = mode === "at-risk" ? AT_RISK_THRESHOLDS : GOOD_THRESHOLDS;

  const activeFilters = [
    filterBranch !== "ALL BRANCHES" ? filterBranch : null,
    filterSemester !== "All Semesters" ? filterSemester : null,
    filterThreshold !== defaultThreshold ? filterThreshold : null,
  ].filter(Boolean);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "min(860px, 96vw)",
        maxHeight: "92vh",
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 14,
        boxShadow: `0 24px 70px rgba(0,0,0,0.65), 0 0 0 1px ${accentColor}22`,
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
          background: `${accentColor}08`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: accentDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${accentColor}30`,
            }}>
              <ModeIcon size={15} color={accentColor} />
            </div>
            <div>
              <p style={{ color: C.textPrimary, fontSize: 14, fontWeight: 600, margin: 0, fontFamily: FONT }}>
                Bulk Email — {modeLabel}
              </p>
              <p style={{ color: C.textMuted, fontSize: 11, margin: "2px 0 0", fontFamily: FONT }}>
                {modeDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 6,
              border: `1px solid ${C.cardBorder}`,
              background: "transparent", color: C.textMuted,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 20px",
          borderBottom: `1px solid ${C.cardBorder}`,
          background: "rgba(255,255,255,0.015)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Filter size={13} color={C.textMuted} />
            <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT, whiteSpace: "nowrap" as const }}>
              Filter by:
            </span>
          </div>
          <FilterDropdown
            value={filterBranch}
            onChange={setFilterBranch}
            options={["ALL BRANCHES", ...BRANCHES]}
            placeholder="ALL BRANCHES"
          />
          <FilterDropdown
            value={filterSemester}
            onChange={setFilterSemester}
            options={["All Semesters", ...SEMESTERS]}
            placeholder="All Semesters"
          />
          <FilterDropdown
            value={filterThreshold}
            onChange={setFilterThreshold}
            options={thresholdOptions}
            placeholder={defaultThreshold}
          />
          {activeFilters.length > 0 && (
            <button
              onClick={() => { setFilterBranch("ALL BRANCHES"); setFilterSemester("All Semesters"); setFilterThreshold(defaultThreshold); }}
              style={{
                background: "transparent", border: `1px solid ${C.cardBorder}`,
                borderRadius: 6, color: C.textMuted, fontSize: 11,
                fontFamily: FONT, cursor: "pointer", padding: "6px 10px",
                whiteSpace: "nowrap" as const, transition: "all 0.15s", flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; (e.currentTarget as HTMLButtonElement).style.borderColor = C.cardBorder; }}
            >
              Clear filters
            </button>
          )}
          {activeFilters.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {activeFilters.map(f => (
                <span key={f} style={{
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}30`,
                  color: accentColor, fontSize: 10, fontFamily: FONT,
                  padding: "2px 8px", borderRadius: 10,
                }}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body — two columns */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

          {/* Left: Student list */}
          <div style={{
            width: 300, flexShrink: 0,
            borderRight: `1px solid ${C.cardBorder}`,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Select-all row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px",
              borderBottom: `1px solid ${C.cardBorder}`,
              background: "rgba(255,255,255,0.02)",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Checkbox
                  checked={selectedIds.size === students.length && students.length > 0}
                  indeterminate={selectedIds.size > 0 && selectedIds.size < students.length}
                  onChange={toggleAll}
                  accent={accentColor}
                />
                <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT }}>
                  Select all
                </span>
              </div>
              <span style={{
                color: accentColor, fontSize: 11, fontWeight: 500, fontFamily: FONT,
                background: accentDim, padding: "2px 8px", borderRadius: 10,
                border: `1px solid ${accentColor}30`,
              }}>
                {selectedIds.size} / {students.length}
              </span>
            </div>

            {/* Students */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {students.length === 0 ? (
                <div style={{
                  padding: "36px 16px", textAlign: "center" as const,
                  color: C.textMuted, fontSize: 12, fontFamily: FONT, lineHeight: 1.6,
                }}>
                  No {modeLabel.toLowerCase()} found<br />for the selected filters.
                </div>
              ) : (
                students.map(s => (
                  <StudentItem
                    key={s.id}
                    student={s}
                    selected={selectedIds.has(s.id)}
                    onToggle={() => toggleStudent(s.id)}
                    accentColor={accentColor}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right: Compose */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

              {/* To: */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 8, padding: "10px 14px",
                marginBottom: 14,
              }}>
                <Mail size={13} color={C.textMuted} />
                <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT }}>To:</span>
                <span style={{
                  color: accentColor, fontSize: 12, fontFamily: FONT,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                }}>
                  {selectedIds.size === 0
                    ? "No recipients selected"
                    : selectedIds.size === 1
                      ? students.find(s => selectedIds.has(s.id))?.email ?? ""
                      : `${selectedIds.size} student${selectedIds.size !== 1 ? "s" : ""} selected`}
                </span>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: C.textMuted, fontSize: 11, fontFamily: FONT, display: "block", marginBottom: 6 }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{
                    width: "100%", background: C.inputBg,
                    border: `1px solid ${C.cardBorder}`, borderRadius: 7,
                    color: C.textPrimary, fontSize: 13, fontFamily: FONT,
                    padding: "9px 12px", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.cardBorder; }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ color: C.textMuted, fontSize: 11, fontFamily: FONT, display: "block", marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={10}
                  style={{
                    width: "100%", background: C.inputBg,
                    border: `1px solid ${C.cardBorder}`, borderRadius: 7,
                    color: C.textPrimary, fontSize: 13, fontFamily: FONT,
                    padding: "10px 12px", resize: "vertical" as const,
                    outline: "none", boxSizing: "border-box",
                    lineHeight: 1.6, transition: "border-color 0.15s", minHeight: 190,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.cardBorder; }}
                />
              </div>

              <button
                onClick={() => setMessage(mode === "at-risk" ? AT_RISK_TEMPLATE : GOOD_ATTENDANCE_TEMPLATE)}
                style={{
                  background: "transparent", border: "none", color: C.textMuted,
                  fontSize: 11, fontFamily: FONT, cursor: "pointer",
                  padding: 0, textDecoration: "underline",
                }}
              >
                Reset to default template
              </button>
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 20px",
              borderTop: `1px solid ${C.cardBorder}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.01)",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={13} color={C.textMuted} />
                <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT }}>
                  {selectedIds.size} recipient{selectedIds.size !== 1 ? "s" : ""} will receive this email
                </span>
              </div>
              <button
                onClick={handleSend}
                disabled={sending || selectedIds.size === 0}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 22px", borderRadius: 8, border: "none",
                  background: sent ? C.green : selectedIds.size === 0 ? "rgba(255,255,255,0.06)" : accentColor,
                  color: selectedIds.size === 0 ? C.textMuted : "#fff",
                  fontSize: 13, fontWeight: 500, fontFamily: FONT,
                  cursor: sending || selectedIds.size === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s", opacity: sending ? 0.7 : 1,
                  minWidth: 150, justifyContent: "center",
                }}
              >
                {sending ? (
                  <span>Sending...</span>
                ) : sent ? (
                  <><CheckCircle2 size={14} /><span>Sent!</span></>
                ) : (
                  <><Send size={13} /><span>Send to {selectedIds.size > 0 ? selectedIds.size : ""} Student{selectedIds.size !== 1 ? "s" : ""}</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, indeterminate, onChange, accent }: {
  checked: boolean; indeterminate?: boolean; onChange: () => void; accent: string;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked || indeterminate ? accent : "rgba(255,255,255,0.2)"}`,
        background: checked || indeterminate ? `${accent}20` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", padding: 0, transition: "all 0.15s",
      }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 8, height: 1.5, background: accent, borderRadius: 1 }} />
      )}
    </button>
  );
}

function StudentItem({ student: s, selected, onToggle, accentColor }: {
  student: Student; selected: boolean; onToggle: () => void; accentColor: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
        background: selected ? `${accentColor}08` : hov ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background 0.1s",
      }}
    >
      <Checkbox checked={selected} onChange={onToggle} accent={accentColor} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: selected ? C.textPrimary : C.textMuted,
          fontSize: 12, fontFamily: FONT, margin: 0,
          whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {s.name}
        </p>
        <p style={{
          color: "rgba(100,116,139,0.65)", fontSize: 10, fontFamily: FONT, margin: "2px 0 0",
          whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {s.branch} · Sem {s.semester} · {s.email}
        </p>
      </div>
      <span style={{ color: accentColor, fontSize: 11, fontWeight: 600, fontFamily: FONT, flexShrink: 0 }}>
        {s.percentage}%
      </span>
    </div>
  );
}

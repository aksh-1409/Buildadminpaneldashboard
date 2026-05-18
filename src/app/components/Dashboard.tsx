import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Users, TrendingUp, TrendingDown, Activity, BarChart2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  mockStudents, SEMESTERS, BRANCHES, MONTHS,
  monthlyAttendanceData, weeklyAttendanceData, daywiseAttendanceData,
  getSpecificDateData, getSpecificWeekData, getSpecificMonthData,
  getBranchSummaries,
} from "../data/mockData";
import StudentListModal from "./StudentListModal";
import BentoCard from "./BentoCard";

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const C = {
  bg: "#0a0e27",
  card: "#0f1430",
  cardBorder: "rgba(0,217,255,0.10)",
  cardBorderHover: "rgba(0,217,255,0.45)",
  cyan: "#00d9ff",
  cyanDim: "rgba(0,217,255,0.12)",
  teal: "#00d9ff",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  inputBg: "rgba(255,255,255,0.04)",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f59e0b",
  purple: "#a78bfa",
};

const PIE_COLORS = [C.green, C.cyan, C.orange, C.red];

function DropdownSelect({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 14px",
          background: C.inputBg,
          border: `1px solid ${open ? "rgba(255,255,255,0.2)" : C.cardBorder}`,
          borderRadius: 8, color: C.textPrimary,
          cursor: "pointer",
          fontFamily: FONT, fontSize: 13,
          transition: "border-color 0.15s",
        }}
      >
        <span style={{ color: value ? C.textPrimary : C.textMuted }}>{value || label || options[0]}</span>
        <ChevronDown size={14} color={C.textMuted} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 500,
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
                width: "100%", textAlign: "left" as const,
                padding: "9px 14px",
                background: value === opt ? "rgba(0,151,167,0.15)" : "transparent",
                border: "none", color: value === opt ? C.cyan : C.textPrimary,
                cursor: "pointer",
                fontFamily: FONT, fontSize: 13,
                transition: "background 0.1s",
                display: "block",
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a2035", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 8, padding: "10px 14px", fontFamily: FONT }}>
        <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontSize: 12, margin: "2px 0" }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily={FONT}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [semester, setSemester] = useState("All");
  const [branch, setBranch] = useState("ALL BRANCHES");
  const [view, setView] = useState("MONTHLY VIEW");
  const [threshold, setThreshold] = useState("THRESHOLD SELECTION");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalThreshold, setModalThreshold] = useState("ALL STUDENTS");
  const [modalBranch, setModalBranch] = useState("ALL BRANCHES");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [specificDate, setSpecificDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [specificMonth, setSpecificMonth] = useState(MONTHS[0]);
  const [specificWeek, setSpecificWeek] = useState(1);

  const semNum = semester === "All" ? null : parseInt(semester.replace("Sem ", ""));
  const filteredStudents = useMemo(() => {
    let s = [...mockStudents];
    if (semNum !== null) s = s.filter(st => st.semester === semNum);
    if (branch !== "ALL BRANCHES") s = s.filter(st => st.branch === branch);
    return s;
  }, [semNum, branch]);

  const stats = useMemo(() => ({
    total: filteredStudents.length,
    totalPresent: filteredStudents.filter(s => s.status !== "detained").length,
    above75: filteredStudents.filter(s => s.percentage >= 75).length,
    below30: filteredStudents.filter(s => s.percentage < 30).length,
  }), [filteredStudents]);

  const branchSummaries = useMemo(() => getBranchSummaries(semester), [semester]);

  const THRESHOLD_MULT: Record<string, number> = {
    "ABOVE 75%": 1.09,
    "ABOVE 50%": 1.03,
    "BELOW 50%": 0.80,
    "BELOW 30%": 0.55,
  };

  const PIE_BUCKETS_MAP: Record<string, Array<{ name: string; test: (p: number) => boolean }>> = {
    "ABOVE 75%": [
      { name: "≥90%",   test: p => p >= 90 },
      { name: "80–90%", test: p => p >= 80 && p < 90 },
      { name: "75–80%", test: p => p >= 75 && p < 80 },
    ],
    "ABOVE 50%": [
      { name: "≥75%",   test: p => p >= 75 },
      { name: "60–75%", test: p => p >= 60 && p < 75 },
      { name: "50–60%", test: p => p >= 50 && p < 60 },
    ],
    "BELOW 50%": [
      { name: "40–50%", test: p => p >= 40 && p < 50 },
      { name: "30–40%", test: p => p >= 30 && p < 40 },
      { name: "<30%",   test: p => p < 30 },
    ],
    "BELOW 30%": [
      { name: "20–30%", test: p => p >= 20 && p < 30 },
      { name: "10–20%", test: p => p >= 10 && p < 20 },
      { name: "<10%",   test: p => p < 10 },
    ],
  };
  const DEFAULT_PIE_BUCKETS = [
    { name: "≥75%",   test: (p: number) => p >= 75 },
    { name: "50–75%", test: (p: number) => p >= 50 && p < 75 },
    { name: "30–50%", test: (p: number) => p >= 30 && p < 50 },
    { name: "<30%",   test: (p: number) => p < 30 },
  ];

  const applyThreshold = (students: typeof filteredStudents) => {
    if (threshold === "ABOVE 75%") return students.filter(s => s.percentage >= 75);
    if (threshold === "ABOVE 50%") return students.filter(s => s.percentage >= 50);
    if (threshold === "BELOW 50%") return students.filter(s => s.percentage < 50);
    if (threshold === "BELOW 30%") return students.filter(s => s.percentage < 30);
    return students;
  };

  const pieData = useMemo(() => {
    const pool = applyThreshold(filteredStudents);
    const buckets = PIE_BUCKETS_MAP[threshold] ?? DEFAULT_PIE_BUCKETS;
    return buckets
      .map(b => ({ name: b.name, value: pool.filter(s => b.test(s.percentage)).length }))
      .filter(d => d.value > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredStudents, threshold]);

  const lineData = useMemo(() => {
    let rawData: Array<Record<string, any>>;
    if (view === "WEEKLY VIEW") rawData = weeklyAttendanceData;
    else if (view === "DAYWISE VIEW") rawData = daywiseAttendanceData;
    else if (view === "BY DATE") rawData = getSpecificDateData(specificDate);
    else if (view === "BY WEEK") rawData = getSpecificWeekData(specificMonth, specificWeek);
    else if (view === "BY MONTH") rawData = getSpecificMonthData(specificMonth);
    else rawData = monthlyAttendanceData;

    const mult = THRESHOLD_MULT[threshold] ?? 1.0;
    const activeBranches = branch === "ALL BRANCHES" ? BRANCHES : [branch];

    return rawData.map(d => {
      const row: Record<string, any> = { period: d.period };
      for (const br of activeBranches) {
        const raw = (d as any)[br] as number;
        row[br] = Math.min(100, Math.max(0, Math.round(raw * mult)));
      }
      return row;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, view, threshold, specificDate, specificMonth, specificWeek]);

  const yDomain = threshold === "BELOW 30%" ? [0, 40] : threshold === "BELOW 50%" ? [20, 65] : [40, 100];

  const lineKeys = branch === "ALL BRANCHES" ? BRANCHES : [branch];
  const lineColors = [C.cyan, C.purple, C.orange, C.green];

  const openModal = (thresh?: string, br?: string) => {
    setModalThreshold(thresh || "ALL STUDENTS");
    setModalBranch(br || (branch !== "ALL BRANCHES" ? branch : "ALL BRANCHES"));
    setModalOpen(true);
  };

  const StatCard = ({ id, label, value, icon: Icon, color, subLabel, onClick }: any) => {
    return (
      <BentoCard onClick={onClick} accent={color || C.cyan} style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 10px", fontFamily: FONT }}>{label}</p>
            <p style={{ color: color || C.textPrimary, fontSize: 28, fontWeight: 700, fontFamily: FONT, margin: 0, lineHeight: 1 }}>{value}</p>
            {subLabel && <p style={{ color: C.textMuted, fontSize: 12, margin: "6px 0 0", fontFamily: FONT }}>{subLabel}</p>}
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${color || C.cyan}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={17} color={color || C.cyan} />
          </div>
        </div>
      </BentoCard>
    );
  };

  return (
    <div
      style={{
        flex: 1, overflowY: "auto", padding: "24px 28px",
        background: C.bg,
        fontFamily: FONT,
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 4px", fontFamily: FONT }}>Dashboard</p>
        <h1 style={{
          color: C.textPrimary, fontFamily: FONT, fontWeight: 600,
          fontSize: 20, margin: 0,
        }}>Dashboard Overview</h1>
      </div>

      {/* Filter Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <DropdownSelect
          value={semester}
          onChange={setSemester}
          options={["All", ...SEMESTERS]}
          label="Semester"
        />
        <DropdownSelect
          value={branch}
          onChange={setBranch}
          options={["ALL BRANCHES", ...BRANCHES]}
          label="Branch"
        />
        <DropdownSelect
          value={view}
          onChange={setView}
          options={["MONTHLY VIEW", "WEEKLY VIEW", "DAYWISE VIEW", "BY DATE", "BY WEEK", "BY MONTH"]}
        />
      </div>

      {/* Filter Row 2 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "stretch" }}>
        <div style={{ flex: 1 }}>
          <DropdownSelect
            value={threshold}
            onChange={setThreshold}
            options={["THRESHOLD SELECTION", "ABOVE 75%", "ABOVE 50%", "BELOW 50%", "BELOW 30%"]}
          />
        </div>
        <button
          onClick={() => openModal(threshold === "THRESHOLD SELECTION" ? "ALL STUDENTS" : threshold)}
          style={{
            padding: "9px 24px",
            background: C.teal,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 500,
            display: "flex", alignItems: "center", gap: 7,
            transition: "opacity 0.15s",
            whiteSpace: "nowrap" as const,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          <Search size={14} />
          Search
        </button>
      </div>

      {/* Contextual pickers for specific date/week/month views */}
      {(view === "BY DATE" || view === "BY WEEK" || view === "BY MONTH") && (
        <div style={{
          display: "flex", gap: 10, alignItems: "center",
          background: C.card, border: `1px solid ${C.cardBorder}`,
          borderRadius: 8, padding: "12px 16px", marginBottom: 20,
        }}>
          <span style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT, whiteSpace: "nowrap" as const }}>
            {view === "BY DATE" ? "Select Date:" : view === "BY WEEK" ? "Select Week:" : "Select Month:"}
          </span>
          {view === "BY DATE" && (
            <input
              type="date"
              value={specificDate}
              onChange={e => setSpecificDate(e.target.value)}
              style={{
                background: C.inputBg, border: `1px solid ${C.cardBorder}`,
                borderRadius: 6, color: C.textPrimary,
                fontFamily: FONT, fontSize: 13,
                padding: "7px 10px", outline: "none",
                colorScheme: "dark" as any,
              }}
            />
          )}
          {view === "BY WEEK" && (
            <>
              <div style={{ width: 130 }}>
                <DropdownSelect value={specificMonth} onChange={setSpecificMonth} options={MONTHS} />
              </div>
              <div style={{ width: 110 }}>
                <DropdownSelect
                  value={`Week ${specificWeek}`}
                  onChange={v => setSpecificWeek(parseInt(v.replace("Week ", "")))}
                  options={["Week 1", "Week 2", "Week 3", "Week 4"]}
                />
              </div>
            </>
          )}
          {view === "BY MONTH" && (
            <div style={{ width: 130 }}>
              <DropdownSelect value={specificMonth} onChange={setSpecificMonth} options={MONTHS} />
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard
          id="total"
          label="Total Students"
          value={stats.total}
          icon={Users}
          color={C.cyan}
          subLabel="enrolled"
          onClick={() => openModal("ALL STUDENTS")}
        />
        <StatCard
          id="present"
          label="Total Present"
          value={stats.totalPresent}
          icon={Activity}
          color={C.green}
          subLabel="active"
          onClick={() => openModal("ABOVE 50%")}
        />
        <StatCard
          id="above75"
          label="Above 75%"
          value={stats.above75}
          icon={TrendingUp}
          color={C.green}
          subLabel="good standing"
          onClick={() => openModal("ABOVE 75%")}
        />
        <StatCard
          id="below30"
          label="Below 30%"
          value={stats.below30}
          icon={TrendingDown}
          color={C.red}
          subLabel="detained risk"
          onClick={() => openModal("BELOW 30%")}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 20 }}>
        {/* Line Chart */}
        <BentoCard style={{ padding: "18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ color: C.textPrimary, fontSize: 14, fontWeight: 500, margin: 0, fontFamily: FONT }}>
              Attendance Trend
              <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 400, marginLeft: 8 }}>
                {view === "MONTHLY VIEW" ? "Monthly"
                  : view === "WEEKLY VIEW" ? "Weekly"
                  : view === "DAYWISE VIEW" ? "Day-wise"
                  : view === "BY DATE" ? specificDate
                  : view === "BY WEEK" ? `${specificMonth} · Week ${specificWeek}`
                  : specificMonth}
              </span>
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {lineKeys.map((k, i) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 10, height: 2, borderRadius: 1, background: lineColors[i] }} />
                  <span style={{ color: C.textMuted, fontSize: 11, fontFamily: FONT }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={195}>
            <LineChart data={lineData} margin={{ top: 4, right: 10, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: C.textMuted, fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} axisLine={false} tickLine={false} domain={yDomain} />
              <Tooltip content={<CustomTooltip />} />
              {lineKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={lineColors[i]}
                  strokeWidth={2}
                  dot={{ fill: lineColors[i], r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: lineColors[i] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </BentoCard>

        {/* Pie Chart */}
        <BentoCard style={{ padding: "18px 16px", display: "flex", flexDirection: "column" }}>
          <p style={{ color: C.textPrimary, fontSize: 14, fontWeight: 500, margin: "0 0 8px", fontFamily: FONT }}>
            Attendance Distribution
          </p>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="46%"
                  outerRadius={72}
                  innerRadius={32}
                  dataKey="value"
                  labelLine={false}
                  label={CustomPieLabel}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => <span style={{ color: C.textMuted, fontSize: 11, fontFamily: FONT }}>{value}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>
      </div>

      {/* Branch Details */}
      <div>
        <p style={{
          color: C.textPrimary, fontSize: 14, fontWeight: 500,
          margin: "0 0 14px", fontFamily: FONT,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <BarChart2 size={15} color={C.teal} />
          Branch Details
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {branchSummaries.map((br) => (
            <BranchCard key={br.name} branch={br} onViewStudents={() => openModal("ALL STUDENTS", br.name)} />
          ))}
        </div>
      </div>

      {modalOpen && (
        <StudentListModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialThreshold={modalThreshold}
          initialBranch={modalBranch}
          semester={semester}
        />
      )}
    </div>
  );
}

function BranchCard({ branch: br, onViewStudents }: { branch: any; onViewStudents: () => void }) {
  const avg = br.avgAttendance;
  const color = avg >= 75 ? C.green : avg >= 60 ? C.cyan : C.orange;

  return (
    <BentoCard onClick={onViewStudents} accent={color} style={{ padding: "16px 18px" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: color,
        opacity: 0.55,
      }} />

      <p style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600, fontFamily: FONT, letterSpacing: 0.5, margin: "0 0 12px" }}>{br.name}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 3px", fontFamily: FONT }}>Students</p>
          <p style={{ color: C.textPrimary, fontSize: 20, fontWeight: 700, fontFamily: FONT, margin: 0 }}>{br.students}</p>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 3px", fontFamily: FONT }}>Avg</p>
          <p style={{ color, fontSize: 20, fontWeight: 700, fontFamily: FONT, margin: 0 }}>{avg}%</p>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${avg}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ color: C.green, fontSize: 11, fontFamily: FONT }}>↑{br.above75} high</span>
          <span style={{ color: C.red, fontSize: 11, fontFamily: FONT }}>↓{br.below30} risk</span>
        </div>
      </div>
    </BentoCard>
  );
}

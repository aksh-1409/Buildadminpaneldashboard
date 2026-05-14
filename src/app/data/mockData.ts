export const SEMESTERS = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
export const BRANCHES = ["CSE", "ME", "EEE", "ECE"];

export interface Student {
  id: number;
  name: string;
  rollno: string;
  branch: string;
  semester: number;
  roomno: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
  status: "good" | "average" | "at-risk" | "detained";
  email: string;
}

const names = [
  "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Rohit Verma",
  "Anjali Gupta", "Vikram Nair", "Kavya Reddy", "Arjun Mehta", "Divya Joshi",
  "Aakash Tiwari", "Pooja Yadav", "Sanjay Mishra", "Neha Agarwal", "Ravi Kumar",
  "Sunita Sharma", "Manish Goel", "Swati Jain", "Deepak Sinha", "Preeti Dubey",
  "Kiran Patil", "Vishal Chaudhary", "Rekha Pandey", "Tarun Bose", "Meena Rao",
  "Suresh Pillai", "Geeta Iyer", "Ramesh Nambiar", "Vidya Krishnamurthy", "Prakash Shetty",
  "Ananya Das", "Soumya Ghosh", "Rajesh Chatterjee", "Poonam Banerjee", "Ayan Roy",
  "Shreya Mukherjee", "Subham Dey", "Chandni Sarkar", "Nikhil Biswas", "Priyanka Mondal",
  "Suman Yadav", "Ramya Venkataraman", "Karthik Subramanian", "Lavanya Naidu", "Ajay Reddy",
  "Pallavi Desai", "Vaibhav Shah", "Riddhi Mehta", "Harsh Patel", "Nisha Thakur",
  "Dev Kapoor", "Ritu Bhatt", "Nitin Srivastava", "Garima Chandra", "Tushar Ahuja",
  "Shweta Bajaj", "Mohit Rawat", "Payal Saxena", "Yash Tripathi", "Ishaan Bhatia",
];

const statusMap = (p: number): Student["status"] => {
  if (p >= 75) return "good";
  if (p >= 60) return "average";
  if (p >= 40) return "at-risk";
  return "detained";
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export const mockStudents: Student[] = names.map((name, i) => {
  const r1 = seededRandom(i * 3);
  const r2 = seededRandom(i * 3 + 1);
  const branch = BRANCHES[i % BRANCHES.length];
  const semester = (i % 8) + 1;
  const total = 55 + Math.floor(r1 * 20);
  const present = Math.floor(total * (0.30 + r2 * 0.65));
  const absent = total - present;
  const percentage = Math.round((present / total) * 1000) / 10;

  return {
    id: i + 1,
    name,
    rollno: `${branch}${String(semester).padStart(2, "0")}${String(i + 1).padStart(3, "0")}`,
    branch,
    semester,
    roomno: `R${100 + (i % 50)}`,
    present,
    absent,
    total,
    percentage,
    status: statusMap(percentage),
    email: `${name.toLowerCase().replace(" ", ".")}@college.edu`,
  };
});

export const monthlyAttendanceData = [
  { period: "Jul", CSE: 82, ME: 76, EEE: 79, ECE: 71 },
  { period: "Aug", CSE: 78, ME: 72, EEE: 75, ECE: 68 },
  { period: "Sep", CSE: 85, ME: 80, EEE: 83, ECE: 77 },
  { period: "Oct", CSE: 74, ME: 69, EEE: 71, ECE: 65 },
  { period: "Nov", CSE: 80, ME: 74, EEE: 77, ECE: 72 },
  { period: "Dec", CSE: 70, ME: 65, EEE: 68, ECE: 60 },
  { period: "Jan", CSE: 88, ME: 83, EEE: 86, ECE: 80 },
];

export const weeklyAttendanceData = [
  { period: "Wk 1", CSE: 84, ME: 77, EEE: 81, ECE: 72 },
  { period: "Wk 2", CSE: 79, ME: 74, EEE: 76, ECE: 69 },
  { period: "Wk 3", CSE: 87, ME: 82, EEE: 85, ECE: 78 },
  { period: "Wk 4", CSE: 72, ME: 67, EEE: 70, ECE: 63 },
  { period: "Wk 5", CSE: 89, ME: 83, EEE: 86, ECE: 80 },
  { period: "Wk 6", CSE: 75, ME: 70, EEE: 73, ECE: 67 },
  { period: "Wk 7", CSE: 83, ME: 78, EEE: 80, ECE: 74 },
  { period: "Wk 8", CSE: 91, ME: 85, EEE: 88, ECE: 82 },
];

export const daywiseAttendanceData = [
  { period: "Mon W1", CSE: 88, ME: 82, EEE: 85, ECE: 79 },
  { period: "Tue W1", CSE: 85, ME: 79, EEE: 82, ECE: 76 },
  { period: "Wed W1", CSE: 82, ME: 76, EEE: 79, ECE: 73 },
  { period: "Thu W1", CSE: 87, ME: 81, EEE: 84, ECE: 78 },
  { period: "Fri W1", CSE: 79, ME: 73, EEE: 76, ECE: 70 },
  { period: "Mon W2", CSE: 84, ME: 78, EEE: 81, ECE: 75 },
  { period: "Tue W2", CSE: 86, ME: 80, EEE: 83, ECE: 77 },
  { period: "Wed W2", CSE: 81, ME: 75, EEE: 78, ECE: 72 },
  { period: "Thu W2", CSE: 90, ME: 84, EEE: 87, ECE: 81 },
  { period: "Fri W2", CSE: 76, ME: 70, EEE: 73, ECE: 67 },
];

export const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

const hashString = (s: string): number =>
  s.split("").reduce((acc, c) => ((acc * 31 + c.charCodeAt(0)) & 0xffffff), 7);

const sr = (seed: number, n: number) => {
  const x = Math.sin(seed + n * 17) * 10000;
  return x - Math.floor(x);
};

export const getSpecificDateData = (dateStr: string) => {
  const seed = hashString(dateStr);
  return Array.from({ length: 6 }, (_, i) => ({
    period: `P${i + 1}`,
    CSE: Math.round(65 + sr(seed, i) * 30),
    ME: Math.round(60 + sr(seed, i + 6) * 33),
    EEE: Math.round(63 + sr(seed, i + 12) * 31),
    ECE: Math.round(57 + sr(seed, i + 18) * 36),
  }));
};

export const getSpecificWeekData = (month: string, week: number) => {
  const seed = hashString(`${month}-W${week}`);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day, i) => ({
    period: day,
    CSE: Math.round(68 + sr(seed, i) * 25),
    ME: Math.round(62 + sr(seed, i + 5) * 28),
    EEE: Math.round(65 + sr(seed, i + 10) * 26),
    ECE: Math.round(59 + sr(seed, i + 15) * 30),
  }));
};

export const getSpecificMonthData = (month: string) => {
  const seed = hashString(month);
  return Array.from({ length: 4 }, (_, i) => ({
    period: `Wk ${i + 1}`,
    CSE: Math.round(65 + sr(seed, i) * 28),
    ME: Math.round(60 + sr(seed, i + 4) * 30),
    EEE: Math.round(63 + sr(seed, i + 8) * 27),
    ECE: Math.round(57 + sr(seed, i + 12) * 32),
  }));
};

export const getStudentDayPeriods = (student: Student, dateStr: string) => {
  const seed = hashString(`${student.id}-${dateStr}`);
  return Array.from({ length: 6 }, (_, i) => ({
    label: `P${i + 1}`,
    present: sr(seed, i) < student.percentage / 100 ? 1 : 0,
  }));
};

export const getStudentWeekDays = (student: Student, month: string, week: number) => {
  const seed = hashString(`${student.id}-${month}-W${week}`);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day, i) => ({
    label: day,
    present: sr(seed, i) < student.percentage / 100 ? 1 : 0,
  }));
};

export const getStudentMonthWeeks = (student: Student, month: string) => {
  const seed = hashString(`${student.id}-${month}`);
  return Array.from({ length: 4 }, (_, i) => ({
    month: `Wk ${i + 1}`,
    percentage: Math.round(Math.max(0, Math.min(100, student.percentage + (sr(seed, i) - 0.5) * 30))),
  }));
};

export const getStudentSemesterData = (student: Student) => {
  return SEMESTERS.map((sem, i) => {
    const seed = hashString(`${student.id}-semester-${i}`);
    const variation = (sr(seed, 0) - 0.5) * 38;
    return {
      month: sem,
      percentage: Math.round(Math.max(0, Math.min(100, student.percentage + variation))),
    };
  });
};

export const generateStudentAttendance = (student: Student) => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: `L${i + 1}`,
    present: seededRandom(student.id * 13 + i) > 0.28 ? 1 : 0,
  }));
};

export const generateMonthlyStudentAttendance = (student: Student) => {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  return months.map((month, i) => ({
    month,
    percentage: Math.round(40 + seededRandom(student.id * 7 + i) * 55),
  }));
};

export interface BranchSummary {
  name: string;
  students: number;
  avgAttendance: number;
  above75: number;
  below30: number;
}

export const getBranchSummaries = (semester: string): BranchSummary[] => {
  const semNum = semester === "All" ? null : parseInt(semester.replace("Sem ", ""));
  return BRANCHES.map((branch) => {
    const students = mockStudents.filter(
      (s) => s.branch === branch && (semNum === null || s.semester === semNum)
    );
    const avg = students.length
      ? Math.round((students.reduce((a, s) => a + s.percentage, 0) / students.length) * 10) / 10
      : 0;
    return {
      name: branch,
      students: students.length,
      avgAttendance: avg,
      above75: students.filter((s) => s.percentage >= 75).length,
      below30: students.filter((s) => s.percentage < 30).length,
    };
  });
};

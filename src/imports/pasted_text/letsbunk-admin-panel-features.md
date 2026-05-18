The LetsBunk Admin Panel is a feature-rich, high-performance administrative command center packed with visual, analytical, and operational tools.

Here is a comprehensive breakdown of the features already implemented and active in the system:

1. Interactive Attendance Analytics (Attendance Showcase)
A visual dashboard presenting detailed analytics through three specialized viewpoints:

Student View: Search for a student to view their overall attendance percentage. Shows an interactive Attendance Calendar where clicking any date displays a detailed, hour-by-hour breakdown of lectures attended or bunked.
Subject View: Load specific subjects by branch and semester to analyze check-ins. Provides a Subject Calendar where clicking a date displays the exact list of attended students (with a hot-swapping subject selector inside the modal).
Teacher View: Select any teacher to inspect their completed classes, allocated branches, semesters, and overall average class attendance.
2. Manual Attendance Marking Console (Overrides)
Allows administrators to manually intervene and manage attendance records:

Lecture Loader: Filter by Semester, Branch, Date, and Period (P1–P8) to retrieve active class lists.
Override Actions: Manually mark students Present or Absent with a simple toggle, including the ability to add a custom justification/reason.
Mark-All Shortcuts: Features quick buttons to Mark All Present or Mark All Absent for a class in one click.
Smart Propagation: Marking a student present for a period propagates the status forward, whereas marking them absent only marks that specific period.
3. Attendance Audit Trail (Administrative Ledger)
Enforces accountability and data security for all manual changes:

Modification Logs: Automatically captures every manual override, logging the Date, Period, Student, Old Status, New Status, Modifying Administrator, Role, custom Reason, and exact Timestamp.
Search & Filter: Find specific overrides by Enrollment number, Date, and Period.
Compliance Export: One-click Export CSV button to download the entire audit log for administrative audits.
4. Classroom WiFi BSSID Management (Hardware Registry)
Configures physical security and coordinates location-based attendance tracking:

Router MAC Registry: Connects classrooms with Room Number, Building location, seating Capacity, and physical WiFi BSSID (MAC Address).
Location-Verification Gateway: Feeds the location-based attendance system, ensuring students can only check in if they are connected to the registered classroom Wi-Fi.
Directory Upload: Supports single additions or Bulk Import via CSV files.
5. Academic Calendar & Data Synchronization Utilities
A fully integrated, dynamic monthly calendar for scheduling and database health:

Holiday & Event Planner: Schedule academic holidays or campus events individually or import them via bulk CSV.
Academic Tools: Separate configurators for Academic Year intervals, specific Semester start/end dates, Exam Schedule timelines, and Event planners.
System Maintenance Toolkit:
🔧 DB Migrate: A custom migration utility that cleans semester/branch schema mismatches and removes duplicate attendance records.
🔁 Resync Attendance: Forces a full recalculation of student metrics from the baseline raw database logs.
🔄 Backfill History: Triggers database hooks to retroactively reconstruct subject attendance histories from legacy records.
6. Dynamic Timetable Grid Builder
A visual editor to coordinate class schedules across college branches:

Matrix Editor: A grid layout mapping out standard period slots against weekdays for custom branches and semesters.
UX Adjustments: Toggle sliders to show/hide teacher allocations, classroom labels, or switch between Default and Compact view densities.
7. Student & Teacher Directory Management
Full CRUD directories for institutional staff and student bodies:

Single Addition & Edit: Dynamic modals to register, edit, or delete profiles.
Bulk Importing: Import hundreds of students or teachers simultaneously using standard CSV uploads.
Advanced Directory Filtering: Real-time search by name, department, enrollment, branch, or semester.
Access Overrides: Toggle administrators' or teachers' permissions (e.g., Timetable editing permissions) directly from the directory table.
8. Subject Directory Manager
Bulk Subject Operations: Duplicate existing subjects, activate/deactivate selections in bulk, and run bulk deletions.
🧹 Purge Ghost Subjects: A cleanup tool that safely purges orphaned attendance records linked to deleted or nonexistent subjects.
Import/Export: Full spreadsheet synchronization via standard CSV files.
9. Class Period timing Configurator
Standard Period Allocations: Add, delete, and configure timings for standard class periods (P1 to P8).
Class Duration Calculator: Automatically summarizes total daily hours and applies new slot schedules globally to all branch timetables.
10. General System Settings & Onboarding
API Gateway Control: Swap the connection between local development (http://localhost:3000) and the active production backend (https://letsbunk-uw7g.onrender.com).
📊 Attendance Threshold Slider: Adjusts the global attendance threshold slider (0–100%). Defines how much time (percentage-wise) a student must spend connected to a classroom's BSSID to be considered "Present".
Onboarding Guidance: Access a Setup Walkthrough Overlay that spotlights components and guides first-time administrators.
Database Backup: Actions to trigger raw MongoDB URI backups and restores.
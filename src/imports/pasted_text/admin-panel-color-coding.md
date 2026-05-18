I am going to check the main stylesheet `styles.css` to see how the color coding (including custom variables, theme colors, status indicators, and attendance colors) is defined and implemented.

Viewed styles.css:1-800

I will perform a search on the `styles.css` file for classes related to status, attendance (present, absent, holidays, etc.) to compile a precise breakdown of the visual color coding used across the admin panel dashboard, attendance list, and calendar.

Searched for "present"

I will search for `success` in `styles.css` to see the class names and how those status color variables are used.

Searched for "success"

I will search for `danger` in `styles.css` to trace how color variables are mapped to UI statuses.

Searched for "danger"

I will run a search for `status` with forward slashes in the path to verify if there was a path parsing discrepancy.

Searched for "status"

I will run a quick PowerShell command to search the stylesheet for references to color codings (such as attendance status like present/absent, holiday, status colors, and theme assignments). This will bypass any path-spacing issues with the search tool.

I will list the contents of the `d:\bunk bssid old` directory (which is my designated workspace) to verify the folder layout there.

Listed directory bunk%20bssid%20old

I will run a command inside the `d:\bunk bssid old` workspace (which contains the exact same `admin-panel` project code) to search `admin-panel/styles.css` for classes and rules related to color coding of statuses, themes, and attendance indicators.

Ran command: `powershell -Command "Get-Content -Path 'admin-panel\styles.css' | Select-String -Pattern 'status|present|absent|holiday|color:|background:|border-color:|#\w+' | Select-Object -First 100"`

I will run another command to specifically look for styles matching standard school attendance states like `present`, `absent`, `bunk`, `late`, or `holiday` to understand the color coding used in the dashboard lists, calendars, and student reports.

Ran command: `powershell -Command "Get-Content -Path 'admin-panel\styles.css' | Select-String -Pattern '\.present|\.absent|\.late|\.bunk|\.holiday|class=|\b(present|absent|late|bunk|holiday)\b' | Select-Object -First 100"`

I will run a command to fetch the CSS rules for these specific attendance and status classes (including context lines) to see exactly what colors are being applied to present, absent, and holiday components.

Ran command: `powershell -Command "Get-Content -Path 'admin-panel\styles.css' | Select-String -Pattern '\.status-present|\.status-absent|\.period-present|\.period-absent|\.holiday-item' -Context 3 | Select-Object -First 50"`

The **LetsBunk Admin Panel UI/UX** employs a comprehensive, semantic **color-coding system** designed to give administrators immediate visual feedback about system status, attendance stats, and theme aesthetics. 

Here is the exact color-coding map implemented across the interface:

---

### 1. Core Visual Accents & Themes (Brand Color Coding)
The interface dynamically updates these system tokens based on the selected user theme:

| Element / Token | 🌙 Night Mode (Default) | ☀️ Day Mode (Light Theme) | UI Role & Feeling |
| :--- | :--- | :--- | :--- |
| **`--primary`** | `#00d9ff` (Neon Cyan) | `#030213` (Deep Charcoal) | Primary actions, hover outlines, active state backgrounds. |
| **`--secondary`** | `#7c3aed` (Electric Purple) | `#3B82F6` (Electric Blue) | Secondary highlights, accent borders, and tags. |
| **`--bg-dark`** | `#0a0e27` (Deep Space Blue) | `#E8DCC4` (Warm Beige) | Main body backdrop color. |
| **`--bg-card`** | `#1a1f3a` (Navy Blue) | `#DDD0B3` (Soft Sand Beige) | Cards, sidebars, modal structures, and data tables. |
| **`--bg-hover`**| `#252b4a` (Lighter Navy Blue) | `#C8B99A` (Muted Sand) | Mouse hover highlights on list items/buttons. |
| **`--border`** | `#2d3748` (Slate Blue) | `rgba(0, 0, 0, 0.1)` (Faint Black) | Separators, table cells, and form outlines. |

---

### 2. Attendance Status Color Coding
To help administrators spot attendance trends and bunks at a glance, students' daily statuses are heavily color-coded across widgets, calendar tiles, list rows, and modal dialogs:

#### **🟩 Present (Attended)**
*   **Night Mode (Dark)**: Translucent neon green (`rgba(16, 185, 129, 0.2)`) background with a vibrant green text (`#10b981`, `--success`).
*   **Day Mode (Light)**: Clean pastel green (`#d1fae5`) background with a deep forest green text (`#065f46`).
*   **Clay Theme (Alternative)**: Translucent bright green (`rgba(74, 222, 128, 0.2)`) with a thick border radius (`20px`) and deep green text (`#16a34a`).
*   **Solid Indicators (`.period-present`)**: Solid emerald green background (`#10b981`) with white text.

#### **🟥 Absent (Bunked)**
*   **Night Mode (Dark)**: Translucent glowing crimson (`rgba(239, 68, 68, 0.2)`) background with high-contrast red text (`#ef4444`, `--danger`).
*   **Day Mode (Light)**: High-contrast pastel red (`#fee2e2`) background with dark crimson text (`#991b1b`).
*   **Clay Theme (Alternative)**: Translucent crimson-pink (`rgba(248, 113, 113, 0.2)`) with rounded corners (`20px`) and red text (`#dc2626`).
*   **Solid Indicators (`.period-absent`)**: Solid danger red background (`#ef4444`) with white text.

---

### 3. System Alerts & Banner Color Coding
Standard alerts, form validation indicators, and overlay messages are semantically color-coded to prevent user errors:

*   **🟢 Success (`--success`)**: `#10b981` (Night) / `#16a34a` (Day) — Used for successful data imports, saved configuration alerts, and positive confirmation dialogs.
*   **🟡 Warning (`--warning`)**: `#f59e0b` (Night) / `#d97706` (Day) — Used for warning messages (e.g. low attendance warnings), backfill alerts, and medium priority task tags.
*   **🔴 Danger / Error (`--danger`)**: `#ef4444` (Night) / `#D4183D` (Day) — Used for critical input errors (e.g. failed login, missing fields), bulk purge warnings, or deleting entities.
*   **🔵 Info / Status (`--primary`)**: `#00d9ff` (Night) / `#030213` (Day) — Standard informational popups and walkthrough steps.

---

### 4. Server Health Connectivity indicator
A small pulsing LED-style status indicator resides at the bottom of the sidebar to notify the admin of real-time server connectivity:
*   **Pulsing Green (`connected`)**: Successfully talking to the cloud backend.
*   **Pulsing Red (`disconnected`)**: Failed to reach the API server (will attempt automatic connection recovery in the background).
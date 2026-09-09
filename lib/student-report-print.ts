/**
 * Generates and opens an A4 Student List Report in a new window.
 * Uses Kalpurush font from /fonts/kalpurush.woff2.
 * mode = "print"  → triggers window.print() directly
 * mode = "pdf"    → opens the window for user to Save as PDF via browser print dialog
 */

export interface ReportEnrollment {
  student_name_en?: string
  student_name_bn?: string | null
  roll_no?: number
  student_uid?: string
  class_name?: string | null
  group_name?: string | null
  section_name?: string | null
  shift_name?: string | null
  session_name?: string | null
  student_gender?: string
  student_mobile?: string | null
  student_religion?: string | null
  admission_type?: string
  student_category?: string
}

export interface ReportMeta {
  schoolName?: string
  schoolAddress?: string
  logoUrl?: string | null
  sessionName?: string
  className?: string
  groupName?: string
  sectionName?: string
  shiftName?: string
  versionName?: string
}

export function openStudentReport(
  enrollments: ReportEnrollment[],
  meta: ReportMeta,
  mode: "print" | "pdf" = "pdf"
) {
  const printedAt = new Date().toLocaleString("en-BD", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  })

  const schoolName  = meta.schoolName  || "School Name"
  const schoolAddr  = meta.schoolAddress || ""
  const logoUrl     = meta.logoUrl || ""

  // Build info line
  const infoParts: string[] = []
  if (meta.versionName) infoParts.push(`<b>Version:</b>${meta.versionName}`)
  if (meta.sessionName)  infoParts.push(`<b>Year:</b>${meta.sessionName}`)
  if (meta.shiftName)    infoParts.push(`<b>Shift:</b>${meta.shiftName}`)
  if (meta.className)    infoParts.push(`<b>Class:</b>${meta.className}`)
  if (meta.groupName)    infoParts.push(`<b>Group:</b>${meta.groupName}`)
  if (meta.sectionName)  infoParts.push(`<b>Section:</b>${meta.sectionName}`)
  const infoLine = infoParts.join("&nbsp;&nbsp;")

  const rows = enrollments.map((e, i) => `
    <tr>
      <td class="center">${i + 1}</td>
      <td class="name">${e.student_name_en || "—"}</td>
      <td class="center">${e.roll_no ?? "—"}</td>
      <td class="center">${e.student_uid || "—"}</td>
      <td class="center">${e.class_name || "n/a"}</td>
      <td class="center">${e.group_name || "n/a"}</td>
      <td class="center">${e.section_name || "n/a"}</td>
    </tr>`).join("")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Student List Report</title>
  <style>
    @font-face {
      font-family: 'Kalpurush';
      src: url('/fonts/kalpurush.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      font-family: 'Kalpurush', 'SolaimanLipi', Arial, sans-serif;
      font-size: 10pt;
      background: #fff;
      color: #000;
    }

    @page {
      size: A4 portrait;
      margin: 8mm 8mm 8mm 8mm;
    }

    .page {
      width: 100%;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    .header-logo {
      width: 52px;
      height: 52px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .header-logo-placeholder {
      width: 52px;
      height: 52px;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #aaa;
      flex-shrink: 0;
    }
    .header-text {
      text-align: center;
    }
    .school-name {
      font-size: 14pt;
      font-weight: bold;
      line-height: 1.2;
    }
    .school-addr {
      font-size: 8.5pt;
      color: #333;
    }
    .report-title {
      font-size: 11pt;
      font-weight: bold;
      margin-top: 2px;
    }

    /* ── Meta bar ── */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      border-bottom: 1px solid #000;
      padding: 2px 0;
      margin-bottom: 3px;
    }
    .meta-bar b { font-weight: 700; }
    .meta-right { text-align: right; white-space: nowrap; }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }
    thead tr {
      background: #222;
      color: #fff;
    }
    thead th {
      padding: 3px 4px;
      border: 1px solid #555;
      text-align: center;
      font-weight: bold;
      white-space: nowrap;
    }
    thead th.name-col { text-align: left; }

    tbody tr { border-bottom: 1px solid #ddd; }
    tbody tr:nth-child(even) { background: #f5f5f5; }
    tbody tr:nth-child(odd)  { background: #fff; }

    tbody td {
      padding: 2.5px 4px;
      border: 1px solid #ccc;
      vertical-align: middle;
    }
    td.center { text-align: center; }
    td.name   { text-align: left; font-weight: 500; }

    /* ── Footer ── */
    .footer {
      margin-top: 6px;
      border-top: 1px solid #000;
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #444;
    }

    /* ── Print tweaks ── */
    @media print {
      .no-print { display: none !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      thead { display: table-header-group; }
      tbody tr { page-break-inside: avoid; }
    }

    /* ── Screen-only print bar ── */
    .print-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #1e3a5f;
      color: #fff;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      font-family: Arial, sans-serif;
      z-index: 1000;
    }
    .print-bar button {
      background: #fff;
      color: #1e3a5f;
      border: none;
      padding: 5px 14px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
    }
    .print-bar button:hover { background: #e0eaff; }
    .print-spacer { height: 44px; }
  </style>
</head>
<body>

  <!-- Screen-only print bar -->
  <div class="print-bar no-print">
    <span>Student List Report &nbsp;|&nbsp; ${enrollments.length} students</span>
    <button onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button onclick="window.close()">✕ Close</button>
  </div>
  <div class="print-spacer no-print"></div>

  <div class="page">
    <!-- Header -->
    <div class="header">
      ${logoUrl
        ? `<img class="header-logo" src="${logoUrl}" alt="Logo" />`
        : `<div class="header-logo-placeholder">LOGO</div>`}
      <div class="header-text">
        <div class="school-name">${schoolName}</div>
        ${schoolAddr ? `<div class="school-addr">${schoolAddr}</div>` : ""}
        <div class="report-title">Student List Report</div>
      </div>
    </div>

    <!-- Meta bar -->
    <div class="meta-bar">
      <div>${infoLine}</div>
      <div class="meta-right"><b>Printed :</b> ${printedAt}</div>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th style="width:28px">S/L</th>
          <th class="name-col">Name</th>
          <th style="width:38px">Roll</th>
          <th style="width:76px">Student Id</th>
          <th style="width:46px">Class</th>
          <th style="width:56px">Group</th>
          <th style="width:50px">Section</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <span>Total Students: <b>${enrollments.length}</b></span>
      <span>${schoolName}</span>
      <span>Page <span class="page-num"></span></span>
    </div>
  </div>

  <script>
    // Auto-trigger based on mode
    const mode = "${mode}";
    window.addEventListener("load", () => {
      if (mode === "print") {
        setTimeout(() => window.print(), 300);
      }
    });
  </script>
</body>
</html>`

  const win = window.open("", "_blank", "width=900,height=700")
  if (!win) {
    alert("Popup blocked. Please allow popups for this site to use Print/PDF.")
    return
  }
  win.document.write(html)
  win.document.close()
}

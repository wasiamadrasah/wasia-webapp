export interface SystemPermissionFeature {
  id: string
  name: string
  actions: ("view" | "add" | "edit" | "delete")[]
}

export interface SystemPermissionModule {
  category: string
  features: SystemPermissionFeature[]
}

export const SYSTEM_PERMISSION_MODULES: SystemPermissionModule[] = [
  {
    category: "Student Information",
    features: [
      { id: "students", name: "Student Management", actions: ["view", "add", "edit", "delete"] },
      { id: "student_enrollments", name: "Enrollment History", actions: ["view", "add", "edit", "delete"] },
      { id: "student_quick_add", name: "Quick Student Add", actions: ["view", "add"] },
      { id: "student_admit", name: "Full Admission", actions: ["view", "add", "edit"] },
      { id: "student_import", name: "Bulk Import", actions: ["view", "add"] },
      { id: "admission_applications", name: "Admission Applications", actions: ["view", "edit", "delete"] },
      { id: "student_settings", name: "Student Settings", actions: ["view", "edit"] },
    ],
  },
  {
    category: "Human Resources",
    features: [
      { id: "employees", name: "Employee Directory", actions: ["view", "add", "edit", "delete"] },
      { id: "employee_attendance", name: "Employee Attendance", actions: ["view", "add", "edit", "delete"] },
      { id: "employee_leave", name: "Employee Leave", actions: ["view", "add", "edit", "delete"] },
    ],
  },
  {
    category: "Academics",
    features: [
      { id: "academics_sessions", name: "Academic Sessions", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_versions", name: "Versions", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_shifts", name: "Shifts", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_classes", name: "Classes", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_sections", name: "Sections", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_groups", name: "Department / Groups", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_class_setup", name: "Class Setup", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_subjects", name: "Subjects", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_teacher_assign", name: "Teacher Assign", actions: ["view", "add", "edit", "delete"] },
      { id: "academics_classrooms", name: "Classroom Management", actions: ["view", "add", "edit", "delete"] },
    ],
  },
  {
    category: "Exam Management",
    features: [
      { id: "exams", name: "Examinations", actions: ["view", "add", "edit", "delete"] },
      { id: "exam_schedules", name: "Exam Schedules", actions: ["view", "add", "edit", "delete"] },
      { id: "exam_attendance", name: "Exam Attendance", actions: ["view", "add", "edit", "delete"] },
      { id: "exam_grades", name: "Grade Management", actions: ["view", "add", "edit", "delete"] },
      { id: "exam_settings", name: "Exam Settings", actions: ["view", "edit"] },
    ],
  },
  {
    category: "Certificates",
    features: [
      { id: "certificates_testimonials", name: "Testimonials", actions: ["view", "add", "edit", "delete"] },
      { id: "certificates_transfer", name: "Transfer Certificates", actions: ["view", "add", "edit", "delete"] },
    ],
  },
  {
    category: "Frontend Content",
    features: [
      { id: "content_events", name: "Events", actions: ["view", "add", "edit", "delete"] },
      { id: "content_notices", name: "Notices", actions: ["view", "add", "edit", "delete"] },
      { id: "content_news", name: "News", actions: ["view", "add", "edit", "delete"] },
      { id: "content_blogs", name: "Blogs", actions: ["view", "add", "edit", "delete"] },
      { id: "content_photo_gallery", name: "Photo Gallery", actions: ["view", "add", "edit", "delete"] },
      { id: "content_video_gallery", name: "Video Gallery", actions: ["view", "add", "edit", "delete"] },
      { id: "content_downloads", name: "Downloads", actions: ["view", "add", "edit", "delete"] },
    ],
  },
  {
    category: "Pages",
    features: [
      { id: "pages_governing_body", name: "Governing Body", actions: ["view", "add", "edit", "delete"] },
      { id: "pages_about", name: "About Page", actions: ["view", "edit"] },
      { id: "pages_history", name: "History Page", actions: ["view", "edit"] },
      { id: "pages_admission", name: "Admission Page", actions: ["view", "edit"] },
      { id: "pages_results", name: "Results Page", actions: ["view", "edit"] },
      { id: "pages_performance_metrics", name: "Performance Metrics", actions: ["view", "edit"] },
    ],
  },
  {
    category: "Website Configuration",
    features: [
      { id: "web_homepage", name: "Homepage Settings", actions: ["view", "edit"] },
      { id: "web_theme", name: "Theme & Appearance", actions: ["view", "edit"] },
    ],
  },
  {
    category: "Quick Communications",
    features: [
      { id: "comm_notifications", name: "Notifications", actions: ["view", "add", "edit", "delete"] },
      { id: "comm_direct_messaging", name: "Direct Messaging", actions: ["view", "add", "delete"] },
      { id: "comm_email", name: "Email", actions: ["view", "add"] },
      { id: "comm_sms", name: "SMS", actions: ["view", "add"] },
    ],
  },
  {
    category: "System Settings",
    features: [
      { id: "settings_account", name: "Account Settings", actions: ["view", "edit"] },
      { id: "settings_institute", name: "Institute Settings", actions: ["view", "edit"] },
      { id: "settings_id_generation", name: "ID Generation Setting", actions: ["view", "edit"] },
      { id: "settings_online_admission", name: "Online Admission Setting", actions: ["view", "edit"] },
      { id: "settings_notifications", name: "Notification Setting", actions: ["view", "edit"] },
      { id: "settings_whatsapp", name: "WhatsApp Messaging", actions: ["view", "edit"] },
      { id: "settings_sms", name: "SMS Setting", actions: ["view", "edit"] },
      { id: "settings_email", name: "Email Setting", actions: ["view", "edit"] },
      { id: "settings_payment_methods", name: "Payment Methods", actions: ["view", "edit"] },
      { id: "settings_front_cms", name: "Front CMS Setting", actions: ["view", "edit"] },
      { id: "settings_roles_permissions", name: "Roles & Permissions", actions: ["view", "add", "edit", "delete"] },
      { id: "settings_backup_restore", name: "Backup & Restore", actions: ["view", "add", "delete"] },
      { id: "settings_languages", name: "Languages", actions: ["view", "add", "edit", "delete"] },
      { id: "settings_activity_logs", name: "Activity Logs", actions: ["view", "delete"] },
    ],
  },
]

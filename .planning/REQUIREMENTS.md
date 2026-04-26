# Requirements: CampusCore ERP

## v1 Requirements

### Authentication & Authorization (AUTH)
- [ ] **AUTH-01**: User registration with email/password (Admin & Student self-reg).
- [ ] **AUTH-02**: JWT-based login with MFA support (TOTP).
- [ ] **AUTH-03**: Role-Based Access Control (RBAC) with 16 predefined roles.
- [ ] **AUTH-04**: Password management (Forgot/Reset/Change) with OTP verification.
- [ ] **AUTH-05**: Session management and force logout capabilities.
- [ ] **AUTH-06**: Profile management including avatar upload and preferences.

### Student Information System (STU)
- [ ] **STU-01**: Comprehensive student profile CRUD (Personal, Academic, Documents).
- [ ] **STU-02**: Semester enrollment and elective course selection.
- [ ] **STU-03**: Student document vault for verification and storage.
- [ ] **STU-04**: ID card generation (PDF) with QR code.
- [ ] **STU-05**: Parent portal for ward's progress and fee monitoring.
- [ ] **STU-06**: Bulk student import/export via CSV/Excel.

### Academic Management (ACAD)
- [ ] **ACAD-01**: Hierarchy management (Departments, Programs, Branches).
- [ ] **ACAD-02**: Course catalog management (Syllabus, Credits, Prerequisites).
- [ ] **ACAD-03**: Timetable generation and management with conflict detection.
- [ ] **ACAD-04**: Academic calendar for events, holidays, and deadlines.
- [ ] **ACAD-05**: Curriculum mapping (CO-PO mapping and attainment).
- [ ] **ACAD-06**: Assignment management (Creation, Submission, Grading).
- [ ] **ACAD-07**: Classroom and lab resource management.

### Attendance Tracking (ATT)
- [ ] **ATT-01**: Daily attendance marking per course/session (Manual & Bulk).
- [ ] **ATT-02**: Real-time attendance percentage calculation and status (Safe/Critical).
- [ ] **ATT-03**: Automatic attendance shortage alerts to students/parents.
- [ ] **ATT-04**: Student leave and On-Duty (OD) request workflow.
- [ ] **ATT-05**: Faculty attendance and monthly reports.

### Examination & Results (EXAM)
- [ ] **EXAM-01**: Exam scheduling and timetable publication.
- [ ] **EXAM-02**: Hall ticket generation and eligibility checking.
- [ ] **EXAM-03**: Seating arrangement generation and room mapping.
- [ ] **EXAM-04**: Marks entry by faculty with multi-level locking.
- [ ] **EXAM-05**: Automated grade calculation (SGPA/CGPA) and result publication.
- [ ] **EXAM-06**: Backlog (ATKT) and revaluation management.
- [ ] **EXAM-07**: Consolidated transcript generation.

### Finance & Fee Management (FIN)
- [ ] **FIN-01**: Dynamic fee structure configuration (Program/Batch wise).
- [ ] **FIN-02**: Student fee ledger with balance tracking and installments.
- [ ] **FIN-03**: Online payment integration (Razorpay/PayTM) with auto-receipts.
- [ ] **FIN-04**: Scholarship application and disbursement tracking.
- [ ] **FIN-05**: Payroll management for employees (Salary structures, Payslips).
- [ ] **FIN-06**: Expense and budget tracking for departments.
- [ ] **FIN-07**: Fee defaulter reporting and automated reminders.

### HR & Employee Management (HR)
- [ ] **HR-01**: Employee profile CRUD and service records.
- [ ] **HR-02**: Leave management with approval workflows and balances.
- [ ] **HR-03**: Recruitment pipeline (Job postings, Applications, Interviews).
- [ ] **HR-04**: Faculty workload allocation and tracking.
- [ ] **HR-05**: Performance appraisal (Self-assessment and HOD review).

### Library Management (LIB)
- [ ] **LIB-01**: Book cataloging (OPAC) with bulk import.
- [ ] **LIB-02**: Circulation management (Issue, Return, Renew, Reserve).
- [ ] **LIB-03**: Fine calculation and collection.
- [ ] **LIB-04**: Library usage and popular book reports.

### Hostel & Mess (HOST)
- [ ] **HOST-01**: Hostel and room allocation management.
- [ ] **HOST-02**: Mess menu management and attendance.
- [ ] **HOST-03**: Hostel complaint and outing request tracking.
- [ ] **HOST-04**: Visitor log and security monitoring.

### Placement & Internships (PLACE)
- [ ] **PLACE-01**: Company database and placement drive management.
- [ ] **PLACE-02**: Student drive registration and eligibility filtering.
- [ ] **PLACE-03**: Interview round tracking and offer management.
- [ ] **PLACE-04**: Internship opportunity tracking and completion.

### Communication & Notifications (COMM)
- [ ] **COMM-01**: In-app notifications for all system events.
- [ ] **COMM-02**: Notice board and circular management with acknowledgments.
- [ ] **COMM-03**: Bulk Email/SMS/Push notifications.

### Reports & Analytics (REPT)
- [ ] **REPT-01**: Role-based dashboards with interactive widgets.
- [ ] **REPT-02**: Standard reports (Enrollment, Finance, Performance).
- [ ] **REPT-03**: Custom report builder for ad-hoc analysis.
- [ ] **REPT-04**: NAAC/NIRF data extraction and bundle generation.

### Grievance Redressal (GRIEV)
- [ ] **GRIEV-01**: Grievance filing with anonymous options.
- [ ] **GRIEV-02**: Automated routing to committees and SLA tracking.

### Alumni Management (ALUM)
- [ ] **ALUM-01**: Alumni directory and self-registration.
- [ ] **ALUM-02**: Alumni events and mentorship matching.

### System & Infrastructure (SYS)
- [ ] **SYS-01**: API Gateway with rate limiting and request logging.
- [ ] **SYS-02**: Centralized file storage (MinIO/S3) with presigned URLs.
- [ ] **SYS-03**: System audit logs and configuration management.

## v2 Requirements (Deferred)
- [ ] AI-based predictive analytics for student performance.
- [ ] Virtual classroom integration (Zoom/Teams).
- [ ] Biometric device direct integration (Real-time).
- [ ] Blockchain-verified digital degree issuance.

## Out of Scope
- [ ] Hardware maintenance of college infrastructure.
- [ ] Physical library book procurement.

---
## Traceability
| Req ID | Phase |
|--------|-------|
| AUTH-01..06 | 2 |
| STU-01..06 | 3 |
| ACAD-01..02 | 4 |
| ACAD-03..04 | 5 |
| ACAD-05..07 | 4 |
| ATT-01..05 | 6 |
| EXAM-01..03 | 7 |
| EXAM-04..07 | 8 |
| FIN-01..03 | 9 |
| FIN-04 | 9 |
| FIN-05 | 10 |
| FIN-06 | 9 |
| FIN-07 | 9 |
| HR-01..05 | 10 |
| LIB-01..04 | 11 |
| HOST-01..04 | 11 |
| TRANS-01 | 11 |
| PLACE-01..04 | 12 |
| COMM-01..03 | 12 |
| REPT-01..04 | 13 |
| GRIEV-01..02 | 13 |
| ALUM-01..02 | 12 |
| SYS-01 | 2 |
| SYS-02..03 | 1 |

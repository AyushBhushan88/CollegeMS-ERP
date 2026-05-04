# Requirements: CampusCore ERP

## Functional Requirements (from SRS v1.0)

### 1. Authentication & Authorization (AUTH)

- [ ] **FR-AUTH-001**: User Registration (Admin & Student self-reg).
- [ ] **FR-AUTH-002**: User Login (MFA, JWT tokens).
- [ ] **FR-AUTH-003**: Role-Based Access Control (RBAC) across 12+ roles.
- [ ] **FR-AUTH-004**: Password Management (Reset via OTP, Reuse protection).
- [ ] **FR-AUTH-005**: Session Management (Idle timeout, concurrent limits).

### 2. Admissions & Enrollment (ADM)

- [ ] **FR-ADM-001**: Online Application Submission (Multi-step, Document upload).
- [ ] **FR-ADM-002**: Merit List Generation (Scoring formula, Reservations).
- [ ] **FR-ADM-003**: Multi-Round Seat Allocation (Real-time vacancy tracking).

### 3. Student Information System (SIS)

- [ ] **FR-SIS-001**: Student Profile Management (Personal, Academic, Medical).
- [ ] **FR-SIS-002**: Student Enrollment & Registration (Course/Elective selection).

### 4. Academic & Curriculum (ACA)

- [ ] **FR-ACA-001**: Program & Course Catalog (Credits, Prerequisites).
- [ ] **FR-ACA-002**: Timetable Generation (Conflict-free automated scheduling).
- [ ] **FR-ACA-003**: CO-PO Mapping & Assessment (OBE Compliance).

### 5. Attendance Management (ATT)

- [ ] **FR-ATT-001**: Lecture-wise Attendance Marking (Faculty interface).
- [ ] **FR-ATT-002**: Automatic Shortage Alerts (Student & Parent notifications).

### 6. Examination Management (EXM)

- [ ] **FR-EXM-001**: Exam Scheduling (Conflict detection).
- [ ] **FR-EXM-002**: Hall Ticket Generation (Eligibility based on fees/attendance).
- [ ] **FR-EXM-003**: Marks Entry & Grade Calculation (Absolute/Relative/CBCS).
- [ ] **FR-EXM-004**: Result Publication & Transcripts.

### 7. Fee & Finance Management (FIN)

- [ ] **FR-FIN-001**: Fee Structure Configuration (Category-wise, installments).
- [ ] **FR-FIN-002**: Online Fee Payment (UPI/Card/NetBanking, Receipt gen).
- [ ] **FR-FIN-003**: Scholarship & Concession Management.

### 8. Faculty & HR Management (HR)

- [ ] **FR-HR-001**: Leave Management (Approval workflow, Balance tracking).

### 9. Library Management (LIB)

- [ ] **FR-LIB-001**: Book Issue & Return (Barcode/QR scanning).

### 10. Hostel Management (HST)

- [ ] **FR-HST-001**: Hostel Room Allocation (Capacity tracking).

### 11. Placement & Training (PLC)

- [ ] **FR-PLC-001**: Placement Drive Management (Eligibility auto-filtering).

### 12. Communication & Notifications (COM)

- [ ] **FR-COM-001**: Multi-Channel Notifications (In-app, Email, SMS).

### 13. Reports & Analytics (RPT)

- [ ] **FR-RPT-001**: Executive Dashboard (Role-specific widgets).
- [ ] **FR-RPT-002**: NAAC / NIRF Report Generation.

### 14. Grievance Redressal (GRV)

- [ ] **FR-GRV-001**: Grievance Lifecycle Tracking (SLA-based routing).

## Non-Functional Requirements (Selection)

- [ ] **NFR-P01**: Page load time ≤ 2 seconds.
- [ ] **NFR-A01**: 99.9% Uptime SLA.
- [ ] **NFR-S01**: Horizontal scalability via microservices.
- [ ] **SR-08**: AES-256 data encryption at rest.

---

## Traceability Matrix (SRS → Phase)

| Req ID     | Module     | Phase |
| ---------- | ---------- | ----- |
| FR-AUTH-\* | Auth       | 1     |
| FR-ADM-\*  | Admissions | 1     |
| FR-SIS-\*  | SIS        | 1     |
| FR-FIN-\*  | Finance    | 1     |
| FR-COM-\*  | Comms      | 1     |
| FR-ACA-\*  | Academic   | 2     |
| FR-ATT-\*  | Attendance | 2     |
| FR-EXM-\*  | Exams      | 2     |
| FR-HR-\*   | HR         | 3     |
| FR-LIB-\*  | Library    | 3     |
| FR-HST-\*  | Hostel     | 3     |
| FR-TRN-\*  | Transport  | 3     |
| FR-PLC-\*  | Placement  | 3     |
| FR-RPT-\*  | Reports    | 3     |
| FR-GRV-\*  | Grievance  | 4     |
| FR-ALM-\*  | Alumni     | 4     |

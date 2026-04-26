# Roadmap: CampusCore ERP

## Summary
**13 phases** | **15 categories** | **80+ requirements**

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Infrastructure | Monorepo & Shared Packages | SYS-02, SYS-03 | Build green, packages linked |
| 2 | Auth & Gateway | Identity & Access Control | AUTH-01..06, SYS-01 | Login works, JWT verified |
| 3 | SIS Core | Student Life Cycle | STU-01, STU-03, STU-06 | Profiles created, Docs uploaded |
| 4 | Academic Base | Curricular Structure | ACAD-01, ACAD-02, ACAD-07 | Programs & Courses live |
| 5 | Scheduling | Timetables & Calendar | ACAD-03, ACAD-04 | No-conflict timetables |
| 6 | Attendance | Real-time Tracking | ATT-01..05 | Marking works, Alerts sent |
| 7 | Exam Setup | Planning & Eligibility | EXAM-01, EXAM-02, EXAM-03 | Hall tickets generated |
| 8 | Grading | Results & Transcripts | EXAM-04, EXAM-05, EXAM-07 | Results published, SGPA calc |
| 9 | Finance | Fees & Payments | FIN-01..03, FIN-07 | Payments processed, Receipts gen |
| 10 | HR & Payroll | Workforce Management | HR-01..05, FIN-05 | Payroll generated, Leave approved |
| 11 | Operations | Library, Hostel, Transport | LIB-01..04, HOST-01..04, TRANS-01 | Services functional |
| 12 | Engagement | Placement, Alumni, Comm | PLACE-01..04, ALUM-01..02, COMM-01..03 | Drives active, Notices sent |
| 13 | Compliance | Analytics & Reporting | REPT-01..04, GRIEV-01..02 | NAAC/NIRF bundles generated |

---

## Phase Details

### Phase 1: Infrastructure
- **Goal**: Setup monorepo structure and shared core packages.
- **Requirements**: SYS-02, SYS-03.
- **Success Criteria**:
  1. pnpm monorepo initialized.
  2. Shared-types, shared-utils, and database packages functional.
  3. Docker-compose for local services (Postgres, Redis, RabbitMQ) operational.

### Phase 2: Auth & Gateway
- **Goal**: Implement identity management and API routing.
- **Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, SYS-01.
- **Success Criteria**:
  1. API Gateway routes requests correctly.
  2. Users can login with MFA.
  3. RBAC middleware enforces permissions.

### Phase 3: SIS Core
- **Goal**: Establish the Student Information System.
- **Requirements**: STU-01, STU-03, STU-06.
- **Success Criteria**:
  1. Student profiles can be created and managed.
  2. Bulk import of students via CSV works.
  3. Documents can be uploaded to S3/MinIO.

### Phase 4: Academic Base
- **Goal**: Define the institution's academic structure.
- **Requirements**: ACAD-01, ACAD-02, ACAD-07.
- **Success Criteria**:
  1. Programs and branches mapped.
  2. Course catalog with syllabus and credits live.

### Phase 5: Scheduling
- **Goal**: Automate scheduling and academic events.
- **Requirements**: ACAD-03, ACAD-04.
- **Success Criteria**:
  1. Weekly timetables generated without teacher/room conflicts.
  2. Academic calendar events visible to all.

### Phase 6: Attendance
- **Goal**: Enable daily attendance tracking and alerts.
- **Requirements**: ATT-01, ATT-02, ATT-03, ATT-04, ATT-05.
- **Success Criteria**:
  1. Faculty can mark attendance via mobile/web.
  2. Low attendance alerts sent via email/SMS.

### Phase 7: Exam Setup
- **Goal**: Prepare for examination cycles.
- **Requirements**: EXAM-01, EXAM-02, EXAM-03.
- **Success Criteria**:
  1. Exam schedules published.
  2. Eligibility verified based on attendance and fees.
  3. Hall tickets available for download.

### Phase 8: Grading
- **Goal**: Process examination marks and publish results.
- **Requirements**: EXAM-04, EXAM-05, EXAM-07.
- **Success Criteria**:
  1. Faculty can enter marks.
  2. SGPA/CGPA calculated accurately.
  3. Transcripts generated.

### Phase 9: Finance
- **Goal**: Manage fees and student payments.
- **Requirements**: FIN-01, FIN-02, FIN-03, FIN-07.
- **Success Criteria**:
  1. Fee structures assigned to batches.
  2. Online payments successful.
  3. Defaulter list updated daily.

### Phase 10: HR & Payroll
- **Goal**: Manage employee lifecycle and payroll.
- **Requirements**: HR-01, HR-02, HR-03, HR-04, HR-05, FIN-05.
- **Success Criteria**:
  1. Employee records managed.
  2. Leave workflow functional.
  3. Monthly payroll generated.

### Phase 11: Operations
- **Goal**: Digitizing support services.
- **Requirements**: LIB-01, LIB-02, LIB-03, LIB-04, HOST-01, HOST-02, HOST-03, HOST-04.
- **Success Criteria**:
  1. Library books issued/returned.
  2. Hostel room allocation live.

### Phase 12: Engagement
- **Goal**: Managing placements, alumni, and communication.
- **Requirements**: PLACE-01, PLACE-02, PLACE-03, PLACE-04, ALUM-01, ALUM-02, COMM-01, COMM-02, COMM-03.
- **Success Criteria**:
  1. Placement drives active.
  2. Bulk notifications delivered.

### Phase 13: Compliance
- **Goal**: Analytics and compliance reporting.
- **Requirements**: REPT-01, REPT-02, REPT-03, REPT-04, GRIEV-01, GRIEV-02.
- **Success Criteria**:
  1. NAAC/NIRF data extracted.
  2. Role-based dashboards functional.

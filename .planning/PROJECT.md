# Project: CampusCore ERP

## Vision
CampusCore is a comprehensive, microservices-based College ERP system designed to digitize and automate all aspects of educational institution management, including Academics, Finance, HR, Library, Hostel, and Placement.

## Core Value
A unified, scalable, and secure platform that provides a single source of truth for students, faculty, and administration.

## Stated Constraints
- **Architecture**: pnpm Monorepo with Microservices (Next.js + NestJS).
- **Database**: PostgreSQL (Prisma), Redis, RabbitMQ.
- **Timeline**: Structured into multiple phases (Fine granularity).
- **Security**: JWT-based RBAC, TLS 1.3, MFA.

## Requirements

### Validated
(None yet — greenfield project)

### Active
- [ ] Core Authentication & RBAC (40 routes)
- [ ] Student Information System (31 routes)
- [ ] Academic Management (Programs, Courses, Timetable - 63 routes)
- [ ] Attendance Tracking (25 routes)
- [ ] Examination & Results (51 routes)
- [ ] Finance & Fee Management (50 routes)
- [ ] HR & Payroll (36 routes)
- [ ] Library Management (22 routes)
- [ ] Hostel & Mess Management (27 routes)
- [ ] Transport Management (15 routes)
- [ ] Placement & Internships (32 routes)
- [ ] Communication & Notifications (27 routes)
- [ ] Reporting & Dashboards (NAAC/NIRF - 22 routes)
- [ ] Grievance Redressal (16 routes)
- [ ] Alumni Management (16 routes)
- [ ] API Gateway & System Services (13 routes)

### Out of Scope
- [Exclusion 1] — Legacy data migration from non-digital systems (unless specified later).
- [Exclusion 2] — Mobile Native apps (Phase 1 focus is Web PWA).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo | Ease of code sharing and cross-service typing | — Pending |
| Microservices | Scalability and independent deployment of modules | — Pending |
| Fine Granularity | High complexity project requires detailed slicing | — Pending |
| Sequential Execution | Ensure stability and clear audit trail in initial phases | — Pending |

---
*Last updated: 2026-04-26 after initialization*

# Project: CampusCore ERP

## Vision

**CampusCore** is a comprehensive, cloud-ready College Enterprise Resource Planning (ERP) system designed to digitize and unify every operational dimension of a higher-education institution — from student admissions and academic scheduling to finance, HR, hostel management, and alumni relations.

## Core Value

To be the single source of truth for every stakeholder in the college ecosystem — enabling data-driven decisions, frictionless operations, and an exceptional academic experience.

## Tech Stack

- **Frontend**: Next.js 14+ (React 18), Shadcn/UI + Tailwind CSS, Zustand / React Query.
- **Backend**: Node.js (NestJS) or Python (FastAPI).
- **Database**: PostgreSQL 16+, Redis 7+, Elasticsearch / Meilisearch.
- **Infrastructure**: Docker + Kubernetes, MinIO/S3, RabbitMQ/Kafka.
- **Security**: Keycloak/Auth.js (JWT, MFA, SSO, RBAC), TLS 1.3.

## Scope (15 Modules)

1. Admissions & Enrollment Management
2. Student Information System (SIS)
3. Academic & Curriculum Management
4. Attendance Management
5. Examination Management
6. Fee & Finance Management
7. Faculty & HR Management
8. Library Management
9. Hostel Management
10. Transport Management
11. Placement & Training Cell
12. Communication & Notifications
13. Reports & Analytics
14. Grievance Redressal
15. Alumni Management

## Out of Scope

- Full Learning Management System (LMS) content delivery.
- Research Grant Management.
- Alumni Fundraising.
- AI-powered chatbot (Phase 4 candidate).
- Mobile-native applications (PWA is in scope).

## Key Decisions

| Decision            | Rationale                                        | Outcome        |
| ------------------- | ------------------------------------------------ | -------------- |
| Microservices       | Independent scalability of modular services      | Approved (SRS) |
| API-First           | Consistent communication across all clients      | Approved (SRS) |
| Multi-Channel Comms | Support for in-app, email, and SMS notifications | Approved (PRD) |
| Multi-Tenant Ready  | Architected for multi-campus institution support | Approved (PRD) |

---

_Initialized from PRD v1.0 and SRS v1.0_

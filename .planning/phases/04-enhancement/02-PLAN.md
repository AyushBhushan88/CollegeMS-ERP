---
wave: 2
depends_on: [1]
files_modified:
  - services/grievance-service/src/main.ts
  - services/grievance-service/src/app.module.ts
  - services/grievance-service/src/grievance/grievance.service.ts
  - services/grievance-service/src/grievance/grievance.controller.ts
autonomous: true
---

<objective>
Implement the Grievance Redressal microservice to handle filing, routing, and tracking of institutional complaints.
</objective>

# Plan: Grievance Redressal Service

This plan focuses on building the backend logic for the Grievance module.

## Tasks

<task id="04-02-01" requirement="FR-GRV-001">
Initialize the `grievance-service` using NestJS and set up basic boilerplate (Dockerfile, configuration, Prisma integration).
</task>

<task id="04-02-02" requirement="FR-GRV-001">
Implement `GrievanceCategory` and `GrievanceCommittee` management endpoints for administrators.
</task>

<task id="04-02-03" requirement="FR-GRV-001, Patent-Alignment">
Implement the patent-aligned SLA-based dynamic routing algorithm to assign grievances to committees based on real-time workload, expertise, and historical resolution speed.
</task>

<task id="04-02-04" requirement="FR-GRV-001">
Implement status tracking and comment threads for complainants and committee members.
</task>

<task id="04-02-05" requirement="FR-GRV-001">
Integrate with `communication-service` via Event Bus to send notifications on status changes and SLA breaches.
</task>

## Verification Criteria

### Automated Tests
- Unit tests for routing logic and SLA calculations.
- Integration tests for API endpoints using Supertest.

### Manual Verification
- File a grievance as a student and verify it is assigned to the correct committee.
- Add a comment to a grievance and verify the other party receives a notification.
- Mark a grievance as resolved and verify the resolution is recorded.

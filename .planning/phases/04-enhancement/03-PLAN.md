---
wave: 3
depends_on: [1]
files_modified:
  - services/alumni-service/src/main.ts
  - services/alumni-service/src/app.module.ts
  - services/alumni-service/src/services/alumni.service.ts
  - services/alumni-service/src/controllers/alumni.controller.ts
  - services/alumni-service/src/services/mentorship.service.ts
  - services/alumni-service/src/services/donation.service.ts
autonomous: true
---

<objective>
Implement the Alumni Management microservice to manage alumni relations, events, and mentorship.
</objective>

# Plan: Alumni Management Service

This plan focuses on building the backend logic for the Alumni module, including mentorship matching and donation verification.

## Tasks

<task id="04-03-01" requirement="FR-ALM-001">
Initialize the `alumni-service` using NestJS and set up boilerplate (Dockerfile, configuration, Prisma integration).
</task>

<task id="04-03-02" requirement="FR-ALM-001">
Implement alumni profile management, including self-registration and administrator verification.
</task>

<task id="04-03-03" requirement="FR-ALM-002">
Implement a searchable alumni directory with filters for batch, department, and industry.
</task>

<task id="04-03-04" requirement="FR-ALM-003, FR-ALM-004, Patent-Alignment">
Implement the patent-aligned cross-domain mentorship matching engine that pairs students with alumni based on career goals, academic background, and industry trends using a weighted scoring algorithm.
</task>

<task id="04-03-05" requirement="FR-ALM-001">
Implement event listeners to automatically create alumni profiles when students graduate.
</task>

<task id="04-03-06" requirement="FR-ALM-005">
Implement donation management with a multi-stage verification workflow (Initiated, Pending, Verified, Rejected) and receipt generation.
</task>

<task id="04-03-07" requirement="FR-ALM-006">
Integrate with `communication-service` to implement automated engagement triggers for alumni anniversaries, donation acknowledgments, and mentorship invitations.
</task>

## Verification Criteria

### Automated Tests
- Unit tests for alumni directory search filters and weighted mentorship matching logic.
- Integration tests for profile creation, verification, and donation state transitions.
- Mock-based tests for communication trigger events.

### Manual Verification
- Register as an alumnus and verify the profile appears in the directory after admin approval.
- Submit a test donation and move it through the verification stages.
- Verify that a 'GRADUATED' student event triggers alumni profile initialization.
- Check if mentorship pairing generates the expected score-based matches.

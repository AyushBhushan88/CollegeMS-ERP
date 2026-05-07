---
wave: 5
depends_on: [4]
files_modified:
  - services/gateway/src/app.module.ts
  - services/gateway/src/main.ts
  - services/student-service/src/graduation/graduation.service.ts
  - apps/web/src/config/navigation.ts
autonomous: true
---

<objective>
Integrate all new Phase 4 microservices (Grievance, Alumni, Analytics) into the API Gateway and finalize cross-service event workflows.
</objective>

# Plan: System Integration & Gateway Configuration

This plan ensures that the new microservices are accessible via the central gateway and that the event-driven "Student-to-Alumni" transition is fully operational.

## Tasks

<task id="04-05-01" requirement="FR-GRV-*, FR-ALM-*, AI Analytics">
Configure the `gateway` service to proxy requests to `grievance-service`, `alumni-service`, and `analytics-service`.
</task>

<task id="04-05-02" requirement="FR-ALM-001">
Implement the "Graduation" event trigger in `student-service` that broadcasts the student data required for `alumni-service` profile creation.
</task>

<task id="04-05-03" requirement="FR-GRV-001">
Verify the multi-channel notification flow for grievances, ensuring `grievance-service` events are correctly handled by `communication-service`.
</task>

<task id="04-05-04" requirement="FR-GRV-*, FR-ALM-*, AI Analytics">
Update the web application navigation and breadcrumbs to include the new modules (Grievance, Alumni, and Analytics Dashboard).
</task>

<task id="04-05-05" requirement="AI Analytics">
Ensure `analytics-service` is correctly receiving event streams from `academic-service` and `attendance-service` for real-time risk scoring.
</task>

## Verification Criteria

### Automated Tests
- Integration tests for Gateway routing to ensure all new service endpoints are reachable.
- Event Bus "smoke tests" to verify messages are delivered between `student-service` and `alumni-service`.

### Manual Verification
- Access the Grievance and Alumni portals through the Gateway URL.
- Trigger a mock "Graduation" in the SIS and verify a new alumni profile is created automatically.
- Check the `analytics-service` logs to confirm it is processing academic events.

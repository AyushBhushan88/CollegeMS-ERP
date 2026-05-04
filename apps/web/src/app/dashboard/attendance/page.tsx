'use client';

import { UserRole } from '@campuscore/shared-constants';

import { AttendanceMarker } from '@/components/attendance/AttendanceMarker';
import { StudentAttendanceView } from '@/components/attendance/StudentAttendanceView';
import { useAuth } from '@/hooks/use-auth';

export default function AttendancePage() {
  const { user } = useAuth();

  const isFaculty =
    user?.role === UserRole.FACULTY ||
    user?.role === UserRole.HOD ||
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.COLLEGE_ADMIN;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          {isFaculty
            ? 'Manage and mark student attendance for your classes.'
            : 'Track your attendance records and eligibility status.'}
        </p>
      </div>

      {isFaculty ? <AttendanceMarker /> : <StudentAttendanceView />}
    </div>
  );
}

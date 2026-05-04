import { AttendanceStatus } from '@campuscore/shared-constants';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  sectionId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string | null;
  markedById: string;
  createdAt: Date;
  updatedAt: Date;
}

import { DayOfWeek } from '@campuscore/shared-constants';

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  credits: number;
  branchId: string;
  semester: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  name: string;
  branchId: string;
  batchYear: number;
  semester: number;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimetableSlot {
  id: string;
  sectionId: string;
  subjectId: string;
  facultyId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  roomNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseOutcome {
  id: string;
  code: string;
  description: string;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectCOPO {
  id: string;
  courseOutcomeId: string;
  programOutcomeId: string;
  mappingStrength: number;
  createdAt: Date;
  updatedAt: Date;
}

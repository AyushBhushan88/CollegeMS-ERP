import { ExamType } from '@campuscore/shared-constants';

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  academicYear: string;
  semester: number;
  branchId: string;
  startDate: Date;
  endDate: Date;
  totalMarks: number;
  weightage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamSchedule {
  id: string;
  examId: string;
  subjectId: string;
  date: Date;
  startTime: string;
  endTime: string;
  roomNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarksEntry {
  id: string;
  examId: string;
  subjectId: string;
  studentId: string;
  marksObtained: number;
  isAbsent: boolean;
  remarks?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcript {
  id: string;
  studentId: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  resultStatus: string;
  isFinalized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

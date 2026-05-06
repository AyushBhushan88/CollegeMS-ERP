import { AlumniStatus, MentorshipStatus } from '@campuscore/shared-constants';

export interface AlumniProfile {
  id: string;
  studentId: string;
  graduationYear: number;
  currentCompany?: string;
  designation?: string;
  industry?: string;
  location?: string;
  linkedInUrl?: string;
  status: AlumniStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  capacity: number;
  registrations: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorshipProgram {
  id: string;
  title: string;
  description: string;
  mentorId: string; // User ID
  startDate: Date;
  endDate: Date;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorshipApplication {
  id: string;
  programId: string;
  alumniId: string;
  status: MentorshipStatus;
  statement?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  alumniId: string;
  amount: number;
  purpose?: string;
  transactionId: string;
  paymentMethod: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterAlumniDto {
  studentId: string;
  graduationYear: number;
  currentCompany?: string;
  designation?: string;
  industry?: string;
  location?: string;
  linkedInUrl?: string;
}

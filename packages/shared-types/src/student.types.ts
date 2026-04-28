import { StudentStatus, Gender, Category } from '@campuscore/shared-constants';

export interface Student {
  id: string;
  userId: string;
  enrollmentNumber: string;
  rollNumber?: string | null;
  programId: string;
  branchId: string;
  batchYear: number;
  currentSemester: number;
  admissionDate: Date;
  category: Category;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string | null;
  aadhaarNumber?: string | null;
  permanentAddress: Address;
  correspondenceAddress: Address;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  guardianRelation: string;
  status: StudentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

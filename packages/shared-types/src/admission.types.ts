import { ApplicationStatus, TransactionStatus } from '@campuscore/shared-constants';

export interface AdmissionApplication {
  id: string;
  userId: string;
  programId: string;
  status: ApplicationStatus;
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  choiceOfProgram: ChoiceOfProgram;
  paymentStatus: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  aadhaarNumber: string;
  fatherName: string;
  motherName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface AcademicDetails {
  tenthPercentage: number;
  tenthYear: number;
  twelfthPercentage: number;
  twelfthYear: number;
  previousCollege?: string;
  graduationPercentage?: number;
}

export interface ChoiceOfProgram {
  preferredPrograms: string[];
}

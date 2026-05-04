import { PlacementStatus } from '@campuscore/shared-constants';

export interface PlacementDrive {
  id: string;
  companyName: string;
  date: Date;
  eligibilityCriteria: any;
  packageDetails?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  studentId: string;
  status: PlacementStatus;
  resumeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlacementResult {
  id: string;
  applicationId: string;
  offerLetterUrl?: string | null;
  packageOffered?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

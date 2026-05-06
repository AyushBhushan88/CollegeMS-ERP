import { GrievanceStatus, GrievancePriority } from '@campuscore/shared-constants';

export interface GrievanceCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrievanceCommittee {
  id: string;
  name: string;
  members: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Grievance {
  id: string;
  ticketNumber: string;
  complainantId: string;
  categoryId: string;
  subject: string;
  description: string;
  priority: GrievancePriority;
  status: GrievanceStatus;
  attachments?: string[];
  isAnonymous: boolean;
  assignedToId?: string; // Committee ID
  resolvedById?: string;
  resolution?: string;
  resolvedAt?: Date;
  slaDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrievanceComment {
  id: string;
  grievanceId: string;
  userId: string;
  comment: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGrievanceDto {
  categoryId: string;
  subject: string;
  description: string;
  priority?: GrievancePriority;
  attachments?: string[];
  isAnonymous?: boolean;
}

export interface UpdateGrievanceStatusDto {
  status: GrievanceStatus;
  resolution?: string;
}

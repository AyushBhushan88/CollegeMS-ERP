import { EmployeeStatus, LeaveType, LeaveStatus } from '@campuscore/shared-constants';

export interface EmployeeProfile {
  id: string;
  userId: string;
  employeeCode: string;
  designation: string;
  department: string;
  joiningDate: Date;
  salary?: number | null;
  status: EmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approvedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  total: number;
  used: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

import { IsString, IsNotEmpty, IsEmail, IsDateString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EmployeeStatus, LeaveType } from '@campuscore/database';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsDateString()
  joiningDate: string;

  @IsNumber()
  @IsOptional()
  salary?: number;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsNumber()
  @IsOptional()
  salary?: number;
}

export class CreateLeaveRequestDto {
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateLeaveStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED' | 'CANCELLED';

  @IsString()
  @IsOptional()
  remarks?: string;
}

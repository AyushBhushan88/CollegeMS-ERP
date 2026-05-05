import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDateString, IsUUID, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ExamType } from '@campuscore/database';

export class ExamScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;
}

export class ScheduleExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ExamType)
  type: ExamType;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsNumber()
  semester: number;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  totalMarks: number;

  @IsNumber()
  weightage: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamScheduleDto)
  schedules: ExamScheduleDto[];
}

export class CreateMarksEntryDto {
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  marksObtained: number;

  @IsBoolean()
  @IsOptional()
  isAbsent?: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class BulkMarksEntryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMarksEntryDto)
  entries: CreateMarksEntryDto[];
}

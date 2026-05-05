import { IsString, IsNotEmpty, IsOptional, IsDateString, IsJSON, IsUUID, IsEnum, IsNumber } from 'class-validator';
import { PlacementStatus } from '@campuscore/database';

export class CreatePlacementDriveDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsDateString()
  date: string;

  @IsOptional()
  eligibilityCriteria?: any;

  @IsString()
  @IsOptional()
  packageDetails?: string;
}

export class ApplyDriveDto {
  @IsUUID()
  @IsNotEmpty()
  driveId: string;

  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsOptional()
  resumeUrl?: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(PlacementStatus)
  status: PlacementStatus;
}

export class RecordResultDto {
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @IsString()
  @IsOptional()
  offerLetterUrl?: string;

  @IsNumber()
  @IsOptional()
  packageOffered?: number;
}

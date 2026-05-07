import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { GrievancePriority, GrievanceStatus } from '@campuscore/shared-constants';
import { CreateGrievanceDto, UpdateGrievanceStatusDto } from '@campuscore/shared-types';

export class CreateGrievanceClassDto implements CreateGrievanceDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(GrievancePriority)
  @IsOptional()
  priority?: GrievancePriority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

export class UpdateGrievanceStatusClassDto implements UpdateGrievanceStatusDto {
  @IsEnum(GrievanceStatus)
  status: GrievanceStatus;

  @IsString()
  @IsOptional()
  resolution?: string;
}

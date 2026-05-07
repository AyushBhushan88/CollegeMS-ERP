import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { RegisterAlumniDto } from '@campuscore/shared-types';

export class RegisterAlumniClassDto implements RegisterAlumniDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  graduationYear: number;

  @IsString()
  @IsOptional()
  currentCompany?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  linkedInUrl?: string;
}

export class AlumniDirectoryFilterDto {
  @IsNumber()
  @IsOptional()
  batch?: number;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  department?: string;
}

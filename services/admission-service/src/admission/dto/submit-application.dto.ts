import { IsString, IsNotEmpty, IsObject, IsArray, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '@campuscore/database';

export class SubmitApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  programId: string;

  @IsObject()
  @IsNotEmpty()
  personalDetails: {
    phone: string;
    address: string;
    gender: string;
    dob: string;
  };

  @IsObject()
  @IsNotEmpty()
  academicDetails: {
    tenthPercentage: number;
    twelfthPercentage: number;
    twelfthBoard: string;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredPrograms?: string[];
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}

import { IsString, IsEmail, IsNotEmpty, IsNumber, IsDateString, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

class PersonalDetailsDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  aadhaarNumber: string;

  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @IsString()
  @IsNotEmpty()
  motherName: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

class AcademicDetailsDto {
  @IsNumber()
  tenthPercentage: number;

  @IsNumber()
  tenthYear: number;

  @IsNumber()
  twelfthPercentage: number;

  @IsNumber()
  twelfthYear: number;

  @IsOptional()
  @IsString()
  previousCollege?: string;

  @IsOptional()
  @IsNumber()
  graduationPercentage?: number;
}

export class SubmitApplicationDto {
  @IsString()
  @IsNotEmpty()
  programId: string;

  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  personalDetails: PersonalDetailsDto;

  @ValidateNested()
  @Type(() => AcademicDetailsDto)
  academicDetails: AcademicDetailsDto;

  @IsArray()
  @IsString({ each: true })
  preferredPrograms: string[];
}

import { IsString, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}

export class CreateLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  credits: number;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsString()
  @IsOptional()
  type?: string;
}

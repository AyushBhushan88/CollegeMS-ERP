import { IsString, IsNumber, IsArray, IsDateString, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '@campuscore/shared-constants';

class FeeHeadDto {
  @IsString()
  headName: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  isMandatory?: boolean;
}

class InstallmentDto {
  @IsNumber()
  installmentNo: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;
}

export class CreateFeeStructureDto {
  @IsString()
  programId: string;

  @IsNumber()
  batchYear: number;

  @IsEnum(Category)
  category: Category;

  @IsString()
  academicYear: string;

  @IsNumber()
  semester: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeHeadDto)
  feeHeads: FeeHeadDto[];

  @IsDateString()
  dueDate: string;

  @IsNumber()
  @IsOptional()
  lateFeePerDay?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InstallmentDto)
  installments?: InstallmentDto[];
}

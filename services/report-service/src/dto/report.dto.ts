import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum ReportType {
  NAAC = 'NAAC',
  NIRF = 'NIRF',
  EXECUTIVE = 'EXECUTIVE',
}

export class GenerateReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsString()
  @IsNotEmpty()
  academicYear: string;
}

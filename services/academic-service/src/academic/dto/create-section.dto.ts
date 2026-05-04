import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsInt()
  batchYear: number;

  @IsInt()
  @Min(1)
  semester: number;

  @IsInt()
  @Min(1)
  capacity: number;
}

import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}

export class AddBookCopyDto {
  @IsString()
  @IsNotEmpty()
  accessionNumber: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class IssueBookDto {
  @IsString()
  @IsNotEmpty()
  accessionNumber: string;

  @IsUUID()
  @IsOptional()
  studentId?: string;

  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @IsDateString()
  dueDate: string;
}

export class ReturnBookDto {
  @IsString()
  @IsNotEmpty()
  accessionNumber: string;
}

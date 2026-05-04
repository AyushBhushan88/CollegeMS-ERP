import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DayOfWeek } from '@campuscore/database';

export class CreateTimetableSlotDto {
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  facultyId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  @IsNotEmpty()
  startTime: string; // HH:mm

  @IsString()
  @IsNotEmpty()
  endTime: string; // HH:mm

  @IsString()
  @IsNotEmpty()
  roomNumber: string;
}

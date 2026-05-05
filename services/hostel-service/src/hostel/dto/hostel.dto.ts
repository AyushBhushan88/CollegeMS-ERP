import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { HostelType, RoomType, RoomStatus } from '@campuscore/database';

export class CreateHostelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(HostelType)
  type: HostelType;

  @IsInt()
  capacity: number;
}

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsInt()
  floor: number;

  @IsEnum(RoomType)
  type: RoomType;

  @IsInt()
  capacity: number;
}

export class AllocateRoomDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  capacity: number;
}

export class AllocateRoomDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}

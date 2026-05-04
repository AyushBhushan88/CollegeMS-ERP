import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  capacity: number;
}

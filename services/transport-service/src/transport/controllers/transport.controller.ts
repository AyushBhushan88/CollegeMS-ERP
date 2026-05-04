import { Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { TransportService } from '../services/transport.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('routes')
  async createRoute(@Body() dto: CreateRouteDto) {
    return this.transportService.createRoute(dto);
  }

  @Post('vehicles')
  async createVehicle(@Body() dto: CreateVehicleDto) {
    return this.transportService.createVehicle(dto);
  }

  @Get('routes')
  async getRoutes() {
    return this.transportService.getRoutes();
  }

  @Get('vehicles')
  async getVehicles() {
    return this.transportService.getVehicles();
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { TransportService } from '../services/transport.service';
import {
  CreateRouteDto,
  CreateVehicleDto,
  AllocateTransportDto,
} from '../dto/transport.dto';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('stats')
  async getStats() {
    return this.transportService.getStats();
  }

  @Get('recent-allocations')
  async getRecentAllocations() {
    return this.transportService.getRecentAllocations();
  }

  @Post('routes')
  async createRoute(@Body() dto: CreateRouteDto) {
    return this.transportService.createRoute(dto);
  }

  @Get('routes')
  async getRoutes() {
    return this.transportService.getRoutes();
  }

  @Post('vehicles')
  async createVehicle(@Body() dto: CreateVehicleDto) {
    return this.transportService.createVehicle(dto);
  }

  @Get('vehicles')
  async getVehicles() {
    return this.transportService.getVehicles();
  }

  @Post('allocations')
  async allocateTransport(@Body() dto: AllocateTransportDto) {
    return this.transportService.allocateTransport(dto);
  }
}

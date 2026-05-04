import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async createRoute(dto: CreateRouteDto) {
    return this.prisma.route.create({ data: dto });
  }

  async createVehicle(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data: dto });
  }

  async getRoutes() {
    return this.prisma.route.findMany();
  }

  async getVehicles() {
    return this.prisma.vehicle.findMany();
  }
}

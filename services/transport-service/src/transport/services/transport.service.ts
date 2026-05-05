import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateRouteDto,
  CreateVehicleDto,
  AllocateTransportDto,
} from '../dto/transport.dto';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async createRoute(dto: CreateRouteDto) {
    const existing = await this.prisma.route.findUnique({
      where: { name: dto.name },
    });

    if (existing)
      throw new ConflictException('Route with this name already exists');

    return this.prisma.route.create({ data: dto });
  }

  async getRoutes() {
    return this.prisma.route.findMany({
      include: {
        _count: {
          select: { allocations: true },
        },
      },
    });
  }

  async createVehicle(dto: CreateVehicleDto) {
    const existing = await this.prisma.vehicle.findUnique({
      where: { registrationNumber: dto.registrationNumber },
    });

    if (existing)
      throw new ConflictException('Vehicle registration number already exists');

    return this.prisma.vehicle.create({ data: dto });
  }

  async getVehicles() {
    return this.prisma.vehicle.findMany({
      include: {
        _count: {
          select: { allocations: true },
        },
      },
    });
  }

  async allocateTransport(dto: AllocateTransportDto) {
    const route = await this.prisma.route.findUnique({
      where: { id: dto.routeId },
    });
    if (!route) throw new NotFoundException('Route not found');

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
      include: {
        _count: {
          select: { allocations: true },
        },
      },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle._count.allocations >= vehicle.capacity) {
      throw new BadRequestException('Vehicle is at full capacity');
    }

    const existingAllocation = await this.prisma.transportAllocation.findUnique(
      {
        where: { studentId: dto.studentId },
      },
    );

    if (existingAllocation) {
      throw new ConflictException(
        'Student is already allocated to a transport route',
      );
    }

    return this.prisma.transportAllocation.create({
      data: {
        studentId: dto.studentId,
        routeId: dto.routeId,
        vehicleId: dto.vehicleId,
        pickupPoint: dto.pickupPoint,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async getStats() {
    const [totalRoutes, totalVehicles, totalAllocations] = await Promise.all([
      this.prisma.route.count(),
      this.prisma.vehicle.count(),
      this.prisma.transportAllocation.count(),
    ]);

    const totalCapacity = await this.prisma.vehicle.aggregate({
      _sum: {
        capacity: true,
      },
    });

    return {
      totalRoutes,
      totalVehicles,
      totalAllocations,
      availableSeats: (totalCapacity._sum.capacity || 0) - totalAllocations,
    };
  }

  async getRecentAllocations() {
    return this.prisma.transportAllocation.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          include: { user: true },
        },
        route: true,
        vehicle: true,
      },
    });
  }
}

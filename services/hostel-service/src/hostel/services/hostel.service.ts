import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHostelDto, CreateRoomDto, AllocateRoomDto } from '../dto/hostel.dto';
import { RoomStatus } from '@campuscore/database';
import { EventBusService } from '../../event-bus/event-bus.service';

@Injectable()
export class HostelService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async createHostel(dto: CreateHostelDto) {
    const existing = await this.prisma.hostel.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Hostel with this name already exists');
    }

    return this.prisma.hostel.create({
      data: dto,
    });
  }

  async findAllHostels() {
    return this.prisma.hostel.findMany({
      include: {
        _count: {
          select: { rooms: true }
        }
      }
    });
  }

  async findHostelDetails(id: string) {
    const hostel = await this.prisma.hostel.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            _count: {
              select: { allocations: true }
            }
          }
        },
      },
    });

    if (!hostel) throw new NotFoundException('Hostel not found');
    return hostel;
  }

  async addRoom(hostelId: string, dto: CreateRoomDto) {
    const hostel = await this.prisma.hostel.findUnique({ where: { id: hostelId } });
    if (!hostel) throw new NotFoundException('Hostel not found');

    const existingRoom = await this.prisma.room.findUnique({
      where: {
        hostelId_roomNumber: {
          hostelId,
          roomNumber: dto.roomNumber,
        },
      },
    });

    if (existingRoom) throw new ConflictException('Room number already exists in this hostel');

    return this.prisma.room.create({
      data: {
        hostelId,
        ...dto,
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  async allocateRoom(dto: AllocateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: {
        hostel: true,
        _count: {
          select: { allocations: true }
        }
      }
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room.status === RoomStatus.MAINTENANCE) {
      throw new BadRequestException('Room is under maintenance');
    }

    if (room._count.allocations >= room.capacity) {
      throw new BadRequestException('Room is at full capacity');
    }

    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
      include: { user: true },
    });

    if (!student) throw new NotFoundException('Student not found');

    const existingAllocation = await this.prisma.roomAllocation.findUnique({
      where: { studentId: dto.studentId },
    });

    if (existingAllocation) {
      throw new ConflictException('Student is already allocated to a room');
    }

    const result = await this.prisma.client.$transaction(async (tx) => {
      const allocation = await tx.roomAllocation.create({
        data: {
          studentId: dto.studentId,
          roomId: dto.roomId,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        },
      });

      // Update room status if it's now full
      if (room._count.allocations + 1 >= room.capacity) {
        await tx.room.update({
          where: { id: room.id },
          data: { status: RoomStatus.OCCUPIED },
        });
      }

      return allocation;
    });

    await this.eventBus.publish('hostel.events', 'room.allocated', {
      studentId: student.id,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      studentEmail: student.user.email,
      hostelName: room.hostel.name,
      roomNumber: room.roomNumber,
      startDate: dto.startDate,
    });

    return result;
  }

  async getStats() {
    const [totalHostels, totalRooms, totalAllocations] = await Promise.all([
      this.prisma.hostel.count(),
      this.prisma.room.count(),
      this.prisma.roomAllocation.count(),
    ]);

    const totalCapacity = await this.prisma.room.aggregate({
      _sum: {
        capacity: true
      }
    });

    return {
      totalHostels,
      totalRooms,
      totalAllocations,
      availableBeds: (totalCapacity._sum.capacity || 0) - totalAllocations,
    };
  }

  async getRecentAllocations() {
    return this.prisma.roomAllocation.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          include: {
            user: true
          }
        },
        room: {
          include: {
            hostel: true
          }
        }
      }
    });
  }
}

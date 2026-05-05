import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto, CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dtos/hr.dto';
import { hashPassword } from '@campuscore/shared-utils';
import { EventBusService } from '../event-bus/event-bus.service';
import { UserRole } from '@campuscore/database';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingEmployee = await this.prisma.employeeProfile.findUnique({
      where: { employeeCode: dto.employeeCode },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this code already exists');
    }

    // Default password for new employees - in a real app, send a reset email
    const hashedPassword = await hashPassword('Welcome@123');

    return this.prisma.client.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: UserRole.FACULTY, // Defaulting to FACULTY, can be made dynamic
        },
      });

      return tx.employeeProfile.create({
        data: {
          userId: user.id,
          employeeCode: dto.employeeCode,
          designation: dto.designation,
          department: dto.department,
          joiningDate: new Date(dto.joiningDate),
          salary: dto.salary,
        },
        include: {
          user: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.employeeProfile.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employeeProfile.findUnique({
      where: { id },
      include: {
        user: true,
        leaveBalances: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    const { firstName, lastName, ...profileData } = dto;

    return this.prisma.client.$transaction(async (tx) => {
      if (firstName || lastName) {
        await tx.user.update({
          where: { id: employee.userId },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          },
        });
      }

      return tx.employeeProfile.update({
        where: { id },
        data: profileData,
        include: {
          user: true,
        },
      });
    });
  }

  async remove(id: string) {
    const employee = await this.findOne(id);

    return this.prisma.client.$transaction(async (tx) => {
      await tx.employeeProfile.delete({ where: { id } });
      return tx.user.update({
        where: { id: employee.userId },
        data: { isActive: false },
      });
    });
  }
}

@Injectable()
export class LeaveRequestService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async submit(employeeId: string, dto: CreateLeaveRequestDto) {
    const employee = await this.prisma.employeeProfile.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: 'PENDING',
      },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.leaveRequest.findMany({
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, adminId: string, dto: UpdateLeaveStatusDto) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: { employee: { include: { user: true } } },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    const updatedRequest = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: dto.status as any,
        approvedById: dto.status === 'APPROVED' ? adminId : null,
      },
    });

    await this.eventBus.publish('hr.events', 'leave.status_updated', {
      requestId: id,
      employeeId: request.employeeId,
      status: dto.status,
      employeeEmail: request.employee.user.email,
    });

    return updatedRequest;
  }
}

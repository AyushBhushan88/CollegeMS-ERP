import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateTimetableSlotDto } from './dto/create-timetable-slot.dto';

@Injectable()
export class AcademicService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  // Subject CRUD
  async createSubject(dto: CreateSubjectDto) {
    const existing = await this.prisma.subject.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Subject with code ${dto.code} already exists`);
    }

    const subject = await this.prisma.subject.create({
      data: dto,
    });

    await this.eventBus.publish('academic-exchange', 'subject.created', subject);
    return subject;
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      include: { branch: true },
    });
  }

  async getSubjectById(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { branch: true },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  // Section CRUD
  async createSection(dto: CreateSectionDto) {
    const section = await this.prisma.section.create({
      data: dto,
    });

    await this.eventBus.publish('academic-exchange', 'section.created', section);
    return section;
  }

  async getSections() {
    return this.prisma.section.findMany({
      include: { branch: true },
    });
  }

  async getSectionById(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { branch: true, students: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  // Timetable CRUD
  async createTimetableSlot(dto: CreateTimetableSlotDto) {
    // Check for conflicts (simplified check, real world would need more logic)
    const conflict = await this.prisma.timetableSlot.findFirst({
      where: {
        OR: [
          {
            sectionId: dto.sectionId,
            dayOfWeek: dto.dayOfWeek,
            startTime: dto.startTime,
          },
          {
            facultyId: dto.facultyId,
            dayOfWeek: dto.dayOfWeek,
            startTime: dto.startTime,
          },
          {
            roomNumber: dto.roomNumber,
            dayOfWeek: dto.dayOfWeek,
            startTime: dto.startTime,
          },
        ],
      },
    });

    if (conflict) {
      throw new ConflictException('Timetable slot conflict detected');
    }

    const slot = await this.prisma.timetableSlot.create({
      data: dto,
    });

    await this.eventBus.publish('academic-exchange', 'timetable.slot.created', slot);
    return slot;
  }

  async getTimetableBySection(sectionId: string) {
    return this.prisma.timetableSlot.findMany({
      where: { sectionId },
      include: { subject: true, faculty: true },
    });
  }

  async getTimetableByFaculty(facultyId: string) {
    return this.prisma.timetableSlot.findMany({
      where: { facultyId },
      include: { subject: true, section: true },
    });
  }
}

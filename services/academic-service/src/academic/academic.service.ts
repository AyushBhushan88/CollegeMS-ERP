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

  // Program CRUD
  async getPrograms() {
    return this.prisma.program.findMany({
      include: { branches: true },
    });
  }

  // OBE Attainment Calculation
  async calculateOBEAttainment(subjectId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        courseOutcomes: true,
        branch: {
          include: { programOutcomes: true },
        },
      },
    });

    if (!subject) throw new NotFoundException('Subject not found');

    const marks = await this.prisma.marksEntry.findMany({
      where: { subjectId },
      include: { exam: true },
    });

    if (marks.length === 0) {
      return {
        subjectId,
        subjectName: subject.name,
        attainment: [],
        message: 'No marks entries found for this subject.',
      };
    }

    // Simplified attainment calculation:
    // % of students scoring above 60% in exams related to this subject
    const threshold = 0.6;
    const attainmentResults = subject.courseOutcomes.map((co) => {
      // In a real system, COs are mapped to specific questions/exams
      // Here we simplify by using overall subject marks
      const totalStudents = marks.length;
      const aboveThreshold = marks.filter(
        (m) => m.marksObtained / m.exam.totalMarks >= threshold,
      ).length;

      const percentage = (aboveThreshold / totalStudents) * 100;
      let level = 0;
      if (percentage >= 70) level = 3;
      else if (percentage >= 60) level = 2;
      else if (percentage >= 50) level = 1;

      return {
        coCode: co.code,
        description: co.description,
        percentage,
        attainmentLevel: level,
      };
    });

    return {
      subjectId,
      subjectName: subject.name,
      attainment: attainmentResults,
    };
  }

  async generateAutomatedTimetable(sectionId: string) {
    const section = await this.getSectionById(sectionId);
    const subjects = await this.prisma.subject.findMany({
      where: { branchId: section.branchId, semester: section.semester },
    });

    const faculties = await this.prisma.user.findMany({
      where: { role: 'FACULTY' },
    });

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];

    const createdSlots: any[] = [];

    // Clear existing slots for the section to avoid conflicts during regeneration
    await this.prisma.timetableSlot.deleteMany({ where: { sectionId } });

    for (const day of days) {
      for (const time of timeSlots) {
        // Randomly pick a subject and a faculty for the demo algorithm
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const faculty = faculties[Math.floor(Math.random() * faculties.length)];

        if (!subject || !faculty) continue;

        try {
          const slot = await this.createTimetableSlot({
            sectionId,
            subjectId: subject.id,
            facultyId: faculty.id,
            dayOfWeek: day as any,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
            roomNumber: `ROOM-${Math.floor(Math.random() * 500)}`,
          });
          createdSlots.push(slot);
        } catch (error) {
          // Skip if conflict detected by thegreedy approach
          continue;
        }
      }
    }

    return createdSlots;
  }
}

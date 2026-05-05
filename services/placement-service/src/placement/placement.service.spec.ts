import { Test, TestingModule } from '@nestjs/testing';
import { PlacementService } from './placement.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('PlacementService', () => {
  let service: PlacementService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      placementDrive: { findUnique: jest.fn() },
      student: { findUnique: jest.fn() },
      placementApplication: { findUnique: jest.fn(), create: jest.fn() },
      transcript: { findFirst: jest.fn() },
    };

    const mockEventBus = { publish: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacementService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventBusService, useValue: mockEventBus },
      ],
    }).compile();

    service = module.get<PlacementService>(PlacementService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apply', () => {
    it('should throw BadRequestException if CGPA is below minimum', async () => {
      prisma.placementDrive.findUnique.mockResolvedValue({
        id: 'drive1',
        eligibilityCriteria: { minCgpa: 8.0 },
      });
      prisma.student.findUnique.mockResolvedValue({ id: 'student1' });
      prisma.placementApplication.findUnique.mockResolvedValue(null);
      prisma.transcript.findFirst.mockResolvedValue({ studentId: 'student1', cgpa: 7.5 });

      await expect(service.apply({ driveId: 'drive1', studentId: 'student1', resumeUrl: '' })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if student has active backlogs', async () => {
      prisma.placementDrive.findUnique.mockResolvedValue({
        id: 'drive1',
        eligibilityCriteria: { minCgpa: 6.0, noActiveBacklogs: true },
      });
      prisma.student.findUnique.mockResolvedValue({ id: 'student1' });
      prisma.placementApplication.findUnique.mockResolvedValue(null);
      prisma.transcript.findFirst.mockResolvedValue({ studentId: 'student1', cgpa: 8.5, resultStatus: 'FAIL' });

      await expect(service.apply({ driveId: 'drive1', studentId: 'student1', resumeUrl: '' })).rejects.toThrow(BadRequestException);
    });

    it('should create application if eligible', async () => {
      prisma.placementDrive.findUnique.mockResolvedValue({
        id: 'drive1',
        eligibilityCriteria: { minCgpa: 7.0, noActiveBacklogs: true },
      });
      prisma.student.findUnique.mockResolvedValue({ id: 'student1' });
      prisma.placementApplication.findUnique.mockResolvedValue(null);
      prisma.transcript.findFirst.mockResolvedValue({ studentId: 'student1', cgpa: 8.5, resultStatus: 'PASS' });
      prisma.placementApplication.create.mockResolvedValue({ id: 'app1' });

      const result = await service.apply({ driveId: 'drive1', studentId: 'student1', resumeUrl: '' });
      expect(result).toEqual({ id: 'app1' });
      expect(prisma.placementApplication.create).toHaveBeenCalled();
    });
  });
});

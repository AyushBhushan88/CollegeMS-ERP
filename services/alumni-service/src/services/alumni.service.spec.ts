import { Test, TestingModule } from '@nestjs/testing';
import { AlumniService } from './alumni.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { AlumniStatus } from '@campuscore/shared-constants';

describe('AlumniService', () => {
  let service: AlumniService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlumniService,
        {
          provide: PrismaService,
          useValue: {
            alumniProfile: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            alumniEvent: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: EventBusService,
          useValue: {
            subscribe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlumniService>(AlumniService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findDirectory', () => {
    it('should return verified alumni based on filters', async () => {
      const filters = { batch: 2024 };
      const mockAlumni = [{ id: '1', graduationYear: 2024, status: AlumniStatus.VERIFIED }];

      (prisma.alumniProfile.findMany as jest.Mock).mockResolvedValue(mockAlumni);

      const result = await service.findDirectory(filters);

      expect(result).toEqual(mockAlumni);
      expect(prisma.alumniProfile.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          graduationYear: 2024,
          status: AlumniStatus.VERIFIED,
        }),
      }));
    });
  });
});

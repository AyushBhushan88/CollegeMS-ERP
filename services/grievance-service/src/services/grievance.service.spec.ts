import { Test, TestingModule } from '@nestjs/testing';
import { GrievanceService } from './grievance.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { GrievancePriority, GrievanceStatus } from '@campuscore/shared-constants';

describe('GrievanceService', () => {
  let service: GrievanceService;
  let prisma: PrismaService;
  let eventBus: EventBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrievanceService,
        {
          provide: PrismaService,
          useValue: {
            grievanceCategory: {
              findUnique: jest.fn(),
            },
            grievance: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            grievanceComment: {
              create: jest.fn(),
            },
            grievanceCommittee: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: EventBusService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GrievanceService>(GrievanceService);
    prisma = module.get<PrismaService>(PrismaService);
    eventBus = module.get<EventBusService>(EventBusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGrievance', () => {
    it('should create a grievance and route it to a committee', async () => {
      const userId = 'user-1';
      const dto = {
        categoryId: 'cat-1',
        subject: 'Test Subject',
        description: 'Test Description',
        priority: GrievancePriority.MEDIUM,
      };

      (prisma.grievanceCategory.findUnique as jest.Mock).mockResolvedValue({
        id: 'cat-1',
        committees: [{ id: 'comm-1' }],
      });

      (prisma.grievance.create as jest.Mock).mockResolvedValue({
        id: 'grv-1',
        ticketNumber: 'GRV-123',
        ...dto,
        assignedToId: 'comm-1',
      });

      const result = await service.createGrievance(userId, dto);

      expect(result).toBeDefined();
      expect(prisma.grievance.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          assignedToId: 'comm-1',
        }),
      }));
      expect(eventBus.publish).toHaveBeenCalledWith('grievance', 'grievance.created', expect.any(Object));
    });
  });
});

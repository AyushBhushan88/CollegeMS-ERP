import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportService', () => {
  let service: ReportService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      transcript: { findMany: jest.fn(), aggregate: jest.fn(), groupBy: jest.fn() },
      student: { count: jest.fn() },
      employeeProfile: { count: jest.fn() },
      placementDrive: { count: jest.fn() },
      placementResult: { count: jest.fn(), aggregate: jest.fn() },
      admissionApplication: { groupBy: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttendanceGpaCorrelation', () => {
    it('should calculate correlation data points', async () => {
      prisma.transcript.findMany.mockResolvedValue([
        { studentId: 's1', cgpa: 8.0 },
        { studentId: 's2', cgpa: 9.0 },
      ]);

      const result = await service.getAttendanceGpaCorrelation();
      expect(result.dataPoints.length).toBe(2);
      expect(result.correlationScore).toBe(0.75);
    });
  });

  describe('generateReportDocument', () => {
    it('should simulate NAAC report generation', async () => {
      prisma.admissionApplication.groupBy.mockResolvedValue([]);
      prisma.employeeProfile.count.mockResolvedValue(100);
      prisma.student.count.mockResolvedValue(1000);

      const result = await service.generateReportDocument('NAAC', 'PDF', '2024-25');
      expect(result.status).toBe('Generated');
      expect(result.format).toBe('PDF');
      expect(result.downloadUrl).toContain('naac_2024-25_pdf.pdf');
    });
    
    it('should simulate NIRF report generation', async () => {
      prisma.placementResult.aggregate.mockResolvedValue({ _avg: { packageOffered: 800000 }, _count: 200 });

      const result = await service.generateReportDocument('NIRF', 'EXCEL', '2024-25');
      expect(result.status).toBe('Generated');
      expect(result.format).toBe('EXCEL');
      expect(result.downloadUrl).toContain('nirf_2024-25_excel.excel');
    });
  });
});

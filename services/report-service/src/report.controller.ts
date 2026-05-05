import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('executive-summary')
  async getExecutiveSummary() {
    return this.reportService.getExecutiveSummary();
  }

  @Get('naac')
  async getNaacReport(@Query('academicYear') academicYear: string) {
    return this.reportService.generateNaacData(academicYear || '2024-25');
  }

  @Get('nirf')
  async getNirfReport(@Query('academicYear') academicYear: string) {
    return this.reportService.generateNirfData(academicYear || '2024-25');
  }

  @Get('academic-performance')
  async getAcademicPerformance() {
    return this.reportService.getAcademicPerformance();
  }

  @Get('attendance-trends')
  async getAttendanceTrends() {
    return this.reportService.getAttendanceTrends();
  }

  @Get('analytics/attendance-gpa')
  async getAttendanceGpaCorrelation() {
    return this.reportService.getAttendanceGpaCorrelation();
  }

  @Get('download')
  async downloadReport(
    @Query('type') type: 'NAAC' | 'NIRF',
    @Query('format') format: 'PDF' | 'EXCEL',
    @Query('academicYear') academicYear: string
  ) {
    return this.reportService.generateReportDocument(type, format || 'PDF', academicYear || '2024-25');
  }
}

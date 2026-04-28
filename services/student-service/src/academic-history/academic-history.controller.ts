import { Controller, Get, Param } from '@nestjs/common';
import { AcademicHistoryService } from './academic-history.service';

@Controller('academic-history')
export class AcademicHistoryController {
  constructor(private readonly academicHistoryService: AcademicHistoryService) {}

  @Get(':studentId')
  async getAcademicHistory(@Param('studentId') studentId: string) {
    return this.academicHistoryService.getAcademicHistory(studentId);
  }

  @Get(':studentId/transcript')
  async getTranscript(@Param('studentId') studentId: string) {
    return this.academicHistoryService.getTranscript(studentId);
  }
}

import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { MarksService } from './marks.service';

@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post()
  async enterMarks(@Body() data: any) {
    return this.marksService.enterMarks(data);
  }

  @Post('bulk')
  async bulkEnterMarks(@Body() data: any[]) {
    return this.marksService.bulkEnterMarks(data);
  }

  @Get('student/:studentId')
  async getMarksByStudent(@Param('studentId') studentId: string) {
    return this.marksService.getMarksByStudent(studentId);
  }

  @Get('exam/:examId')
  async getMarksByExam(@Param('examId') examId: string, @Query('subjectId') subjectId?: string) {
    return this.marksService.getMarksByExam(examId, subjectId);
  }
}

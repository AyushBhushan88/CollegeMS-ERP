import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarksEntryDto, BulkMarksEntryDto } from '../exams/dto/exam.dto';

@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post()
  async enterMarks(@Body() dto: CreateMarksEntryDto) {
    return this.marksService.enterMarks(dto);
  }

  @Post('bulk')
  async bulkEnterMarks(@Body() dto: BulkMarksEntryDto) {
    return this.marksService.bulkEnterMarks(dto);
  }

  @Get()
  async getMarks(
    @Query('examId') examId: string,
    @Query('subjectId') subjectId?: string,
    @Query('studentId') studentId?: string,
  ) {
    if (studentId) {
      return this.marksService.getMarksByStudent(studentId);
    }
    return this.marksService.getMarksByExam(examId, subjectId);
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

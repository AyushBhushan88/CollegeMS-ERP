import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ScheduleExamDto } from './dto/exam.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('schedule')
  async scheduleExam(@Body() dto: ScheduleExamDto) {
    return this.examsService.scheduleExam(dto);
  }

  @Get()
  async getAllExams() {
    return this.examsService.getAllExams();
  }

  @Get(':id')
  async getExamById(@Param('id') id: string) {
    return this.examsService.getExamById(id);
  }

  @Get('schedules/exam/:examId')
  async getSchedulesByExam(@Param('examId') examId: string) {
    const exam = await this.examsService.getExamById(examId);
    return exam?.schedules || [];
  }
}

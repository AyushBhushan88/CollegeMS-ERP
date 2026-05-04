import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamType } from '@campuscore/database';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  async scheduleExam(@Body() data: any) {
    return this.examsService.scheduleExam(data);
  }

  @Get()
  async getAllExams() {
    return this.examsService.getAllExams();
  }

  @Get(':id')
  async getExamById(@Param('id') id: string) {
    return this.examsService.getExamById(id);
  }
}

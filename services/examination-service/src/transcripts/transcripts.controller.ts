import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TranscriptsService } from './transcripts.service';

@Controller('transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  @Post('generate')
  async generateTranscript(@Body() data: { studentId: string; semester: number }) {
    return this.transcriptsService.generateTranscript(data.studentId, data.semester);
  }

  @Get('student/:studentId')
  async getStudentTranscripts(@Param('studentId') studentId: string) {
    return this.transcriptsService.getTranscriptsByStudent(studentId);
  }

  @Get(':studentId')
  async getTranscripts(@Param('studentId') studentId: string) {
    return this.transcriptsService.getTranscriptsByStudent(studentId);
  }
}

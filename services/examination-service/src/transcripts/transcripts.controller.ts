import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TranscriptsService } from './transcripts.service';

@Controller('transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  @Post('generate/:studentId/:semester')
  async generateTranscript(
    @Param('studentId') studentId: string,
    @Param('semester') semester: string,
  ) {
    return this.transcriptsService.generateTranscript(studentId, parseInt(semester));
  }

  @Get(':studentId')
  async getTranscripts(@Param('studentId') studentId: string) {
    return this.transcriptsService.getTranscriptsByStudent(studentId);
  }
}

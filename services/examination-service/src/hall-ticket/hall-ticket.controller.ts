import { Controller, Get, Query, Param } from '@nestjs/common';
import { HallTicketService } from './hall-ticket.service';

@Controller('hall-ticket')
export class HallTicketController {
  constructor(private readonly hallTicketService: HallTicketService) {}

  @Get('eligibility')
  async checkEligibility(
    @Query('studentId') studentId: string,
    @Query('examId') examId: string,
  ) {
    return this.hallTicketService.checkEligibility(studentId, examId);
  }
}

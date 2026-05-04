import { Controller, Get, Query, Param } from '@nestjs/common';
import { HallTicketService } from './hall-ticket.service';

@Controller('hall-tickets')
export class HallTicketController {
  constructor(private readonly hallTicketService: HallTicketService) {}

  @Get('eligibility/:studentId')
  async checkEligibility(
    @Param('studentId') studentId: string,
    @Query('semester') semester: string,
  ) {
    return this.hallTicketService.checkEligibility(studentId, parseInt(semester, 10));
  }
}

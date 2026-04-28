import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('apply')
  async submitApplication(@Request() req: any, @Body() dto: SubmitApplicationDto) {
    // In a real app, userId would come from JWT
    const userId = req.user?.id || 'temp-user-id'; 
    return this.admissionService.submitApplication(userId, dto);
  }

  @Get('merit-list/:programId')
  async getMeritList(@Param('programId') programId: string) {
    return this.admissionService.getMeritList(programId);
  }
}

import { Controller, Post, Get, Body, Param, UseGuards, Request, Put, Query } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitApplicationDto, UpdateApplicationStatusDto } from './dto/submit-application.dto';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('apply')
  async submitApplication(@Request() req: any, @Body() dto: SubmitApplicationDto) {
    const userId = req.body.userId || req.user?.id; 
    return this.admissionService.submitApplication(userId, dto);
  }

  @Get('applications')
  async getApplications(@Query('userId') userId?: string) {
    if (userId) {
      return this.admissionService.findUserApplications(userId);
    }
    return this.admissionService.findAllApplications();
  }

  @Put('applications/:id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.admissionService.updateStatus(id, dto);
  }

  @Get('merit-list/:programId')
  async getMeritList(@Param('programId') programId: string) {
    return this.admissionService.getMeritList(programId);
  }
}

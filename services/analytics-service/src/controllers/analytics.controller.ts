import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('student/:id/risk')
  getStudentRisk(@Param('id') id: string) {
    return this.analyticsService.calculateRiskScore(id);
  }

  @Get('performance')
  getPerformanceInsights(@Query('branchId') branchId?: string) {
    return this.analyticsService.getPerformanceInsights(branchId);
  }
}

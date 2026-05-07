import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async onModuleInit() {
    // Subscribe to attendance and marks events for real-time risk analysis
    await this.eventBus.subscribe('attendance', 'attendance.marked', 'analytics-service.risk-queue', async (data) => {
      await this.calculateRiskScore(data.studentId);
    });

    await this.eventBus.subscribe('examination', 'marks.entered', 'analytics-service.risk-queue', async (data) => {
      await this.calculateRiskScore(data.studentId);
    });
  }

  async calculateRiskScore(studentId: string) {
    // Simplified Predictive Model for "At-Risk" Students
    // Risk factors: Low attendance (< 75%) and low exam marks (< 40%)

    const attendanceRecords = await this.prisma.attendanceRecord.findMany({
      where: { studentId }
    });
    
    const attendancePercentage = attendanceRecords.length > 0 
      ? (attendanceRecords.filter(r => r.status === 'PRESENT').length / attendanceRecords.length) * 100
      : 100;

    const examMarks = await this.prisma.marksEntry.findMany({
      where: { studentId }
    });

    const averageMarks = examMarks.length > 0
      ? examMarks.reduce((acc, curr) => acc + curr.marksObtained, 0) / examMarks.length
      : 100;

    let riskLevel = 'LOW';
    if (attendancePercentage < 60 || averageMarks < 35) {
      riskLevel = 'HIGH';
    } else if (attendancePercentage < 75 || averageMarks < 50) {
      riskLevel = 'MEDIUM';
    }

    // In a real implementation, we would store this in a cache or a dedicated Risk table
    // For now, we return the calculated insight
    return {
      studentId,
      attendancePercentage,
      averageMarks,
      riskLevel,
      lastUpdated: new Date(),
    };
  }

  async getPerformanceInsights(branchId?: string) {
    // Aggregate insights for a branch or college
    const students = await this.prisma.student.findMany({
      where: branchId ? { branchId } : undefined,
      select: { id: true, enrollmentNumber: true }
    });

    const insights = await Promise.all(students.map(s => this.calculateRiskScore(s.id)));
    
    return {
      totalStudents: students.length,
      riskDistribution: {
        HIGH: insights.filter(i => i.riskLevel === 'HIGH').length,
        MEDIUM: insights.filter(i => i.riskLevel === 'MEDIUM').length,
        LOW: insights.filter(i => i.riskLevel === 'LOW').length,
      },
      averageAttendance: insights.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / insights.length,
    };
  }
}

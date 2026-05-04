import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { GetAttendanceQueryDto } from './dto/get-attendance-query.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  async markAttendance(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }

  @Get()
  async getAttendance(@Query() query: GetAttendanceQueryDto) {
    return this.attendanceService.getAttendance(query);
  }

  @Get('stats/:studentId')
  async getStudentStats(
    @Param('studentId') studentId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.attendanceService.getStudentStats(studentId, subjectId);
  }
}

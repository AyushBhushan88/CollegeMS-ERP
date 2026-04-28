import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':studentId/enroll')
  async enrollStudent(
    @Param('studentId') studentId: string,
    @Body() enrollmentData: any,
  ) {
    return this.enrollmentService.enrollStudent(studentId, enrollmentData);
  }

  @Get(':studentId/courses')
  async getStudentEnrollments(@Param('studentId') studentId: string) {
    return this.enrollmentService.getStudentEnrollments(studentId);
  }
}

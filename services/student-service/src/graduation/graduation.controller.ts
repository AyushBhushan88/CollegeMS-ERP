import { Controller, Post, Param } from '@nestjs/common';
import { GraduationService } from './graduation.service';

@Controller('graduation')
export class GraduationController {
  constructor(private readonly graduationService: GraduationService) {}

  @Post(':studentId/graduate')
  async graduateStudent(@Param('studentId') studentId: string) {
    return this.graduationService.graduateStudent(studentId);
  }
}

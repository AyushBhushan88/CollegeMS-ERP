import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  @Get(':id')
  async getStudentDetails(@Param('id') id: string) {
    return this.studentService.getStudentDetails(id);
  }

  @Patch(':id')
  async updateStudentProfile(
    @Param('id') id: string,
    @Body() updateDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudentProfile(id, updateDto);
  }
}

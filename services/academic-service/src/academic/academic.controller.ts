import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateTimetableSlotDto } from './dto/create-timetable-slot.dto';

@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // Subjects
  @Post('subjects')
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicService.createSubject(dto);
  }

  @Get('subjects')
  getSubjects() {
    return this.academicService.getSubjects();
  }

  @Get('subjects/:id')
  getSubjectById(@Param('id') id: string) {
    return this.academicService.getSubjectById(id);
  }

  // Sections
  @Post('sections')
  createSection(@Body() dto: CreateSectionDto) {
    return this.academicService.createSection(dto);
  }

  @Get('sections')
  getSections() {
    return this.academicService.getSections();
  }

  @Get('sections/:id')
  getSectionById(@Param('id') id: string) {
    return this.academicService.getSectionById(id);
  }

  // Timetable
  @Post('timetable')
  createTimetableSlot(@Body() dto: CreateTimetableSlotDto) {
    return this.academicService.createTimetableSlot(dto);
  }

  @Get('timetable/section/:sectionId')
  getTimetableBySection(@Param('sectionId') sectionId: string) {
    return this.academicService.getTimetableBySection(sectionId);
  }

  @Get('timetable/faculty/:facultyId')
  getTimetableByFaculty(@Param('facultyId') facultyId: string) {
    return this.academicService.getTimetableByFaculty(facultyId);
  }

  @Post('timetable/generate/:sectionId')
  generateTimetable(@Param('sectionId') sectionId: string) {
    return this.academicService.generateAutomatedTimetable(sectionId);
  }

  @Get('programs')
  getPrograms() {
    return this.academicService.getPrograms();
  }

  @Get('obe/attainment/:subjectId')
  calculateOBEAttainment(@Param('subjectId') subjectId: string) {
    return this.academicService.calculateOBEAttainment(subjectId);
  }
}

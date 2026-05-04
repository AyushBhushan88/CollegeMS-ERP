import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranscriptsService {
  constructor(private prisma: PrismaService) {}

  async generateTranscript(studentId: string, semester: number) {
    // 1. Fetch all marks for the student in this semester
    const marks = await this.prisma.marksEntry.findMany({
      where: {
        studentId,
        exam: {
          semester,
        },
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    if (marks.length === 0) {
      throw new Error('No marks found for this semester');
    }

    // 2. Simple GPA calculation logic (placeholder for actual grading system)
    let totalPoints = 0;
    let totalCredits = 0;

    for (const mark of marks) {
      const credits = mark.subject.credits;
      const percentage = (mark.marksObtained / mark.exam.totalMarks) * 100;
      
      // Simple 10-point scale conversion
      const gradePoint = percentage / 10; 
      
      totalPoints += gradePoint * credits;
      totalCredits += credits;
    }

    const sgpa = totalPoints / totalCredits;

    // 3. Upsert Transcript
    const transcript = await this.prisma.transcript.upsert({
      where: {
        studentId_semester: {
          studentId,
          semester,
        },
      },
      update: {
        sgpa,
        totalCredits,
        earnedCredits: totalCredits, // Assume all earned for now
        resultStatus: sgpa >= 4 ? 'PASS' : 'FAIL',
        isFinalized: true,
      },
      create: {
        studentId,
        semester,
        sgpa,
        cgpa: sgpa, // Should calculate based on previous semesters
        totalCredits,
        earnedCredits: totalCredits,
        resultStatus: sgpa >= 4 ? 'PASS' : 'FAIL',
        isFinalized: true,
      },
    });

    return transcript;
  }

  async getTranscriptsByStudent(studentId: string) {
    return this.prisma.transcript.findMany({
      where: { studentId },
      orderBy: { semester: 'asc' },
    });
  }
}

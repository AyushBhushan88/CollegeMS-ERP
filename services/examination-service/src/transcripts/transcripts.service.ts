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

    // 3. Calculate CGPA (Average of all finalized SGPA including this one)
    const previousTranscripts = await this.prisma.transcript.findMany({
      where: {
        studentId,
        semester: { lt: semester },
        isFinalized: true,
      },
    });

    const allSgpas = [...previousTranscripts.map(t => t.sgpa), sgpa];
    const cgpa = allSgpas.reduce((a, b) => a + b, 0) / allSgpas.length;

    // 4. Upsert Transcript
    const transcript = await this.prisma.transcript.upsert({
      where: {
        studentId_semester: {
          studentId,
          semester,
        },
      },
      update: {
        sgpa,
        cgpa,
        totalCredits,
        earnedCredits: totalCredits,
        resultStatus: sgpa >= 4 ? 'PASS' : 'FAIL',
        isFinalized: true,
      },
      create: {
        studentId,
        semester,
        sgpa,
        cgpa,
        totalCredits,
        earnedCredits: totalCredits,
        resultStatus: sgpa >= 4 ? 'PASS' : 'FAIL',
        isFinalized: true,
      },
      include: {
        student: { include: { user: true } }
      }
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

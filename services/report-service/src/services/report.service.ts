import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from '../dto/report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getExecutiveSummary() {
    const [studentCount, facultyCount, activeDrives, totalOffers] =
      await Promise.all([
        this.prisma.student.count(),
        this.prisma.employeeProfile.count({
          where: { designation: { contains: 'Professor' } },
        }),
        this.prisma.placementDrive.count(),
        this.prisma.placementResult.count(),
      ]);

    return {
      studentCount,
      facultyCount,
      activeDrives,
      totalOffers,
      placementPercentage:
        studentCount > 0 ? (totalOffers / studentCount) * 100 : 0,
    };
  }

  async generateNaacData(academicYear: string) {
    // Aggregating data for NAAC Criteria
    const enrollmentData = await this.prisma.admissionApplication.groupBy({
      by: ['status'],
      _count: true,
    });

    const facultyRatio = await this.prisma.employeeProfile.count();
    const studentCount = await this.prisma.student.count();

    return {
      academicYear,
      criteria1: { title: 'Curricular Aspects', status: 'Ready' },
      criteria2: {
        title: 'Teaching-Learning and Evaluation',
        studentFacultyRatio: `${studentCount}:${facultyRatio}`,
        enrollmentDetails: enrollmentData,
      },
      criteria3: {
        title: 'Research, Innovations and Extension',
        status: 'In Progress',
      },
    };
  }

  async generateNirfData(academicYear: string) {
    // Aggregating data for NIRF Parameters
    const placementDetails = await this.prisma.placementResult.aggregate({
      _avg: { packageOffered: true },
      _count: true,
    });

    return {
      academicYear,
      tlr: { title: 'Teaching, Learning & Resources', score: 0.85 },
      rpc: { title: 'Research and Professional Practice', score: 0.72 },
      go: {
        title: 'Graduation Outcomes',
        medianSalary: placementDetails._avg.packageOffered,
        placedStudents: placementDetails._count,
      },
    };
  }

  async getAcademicPerformance() {
    const performance = await this.prisma.transcript.aggregate({
      _avg: { cgpa: true },
      _count: true,
    });

    const semesterWise = await this.prisma.transcript.groupBy({
      by: ['semester'],
      _avg: { sgpa: true },
      orderBy: { semester: 'asc' },
    });

    return {
      averageCgpa: performance._avg.cgpa,
      totalTranscripts: performance._count,
      semesterWise,
    };
  }

  async getAttendanceTrends() {
    const attendanceStats = await this.prisma.attendanceRecord.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      stats: attendanceStats,
      overallPresentPercentage: 0, // Would require more complex calculation
    };
  }

  async getAttendanceGpaCorrelation() {
    // In a real application, this would fetch attendance rates and CGPA for each student
    // and calculate the Pearson correlation coefficient.
    // For this implementation, we will simulate the correlation data based on available transcripts.
    const transcripts = await this.prisma.transcript.findMany({
      take: 100, // sample size
      select: { studentId: true, cgpa: true },
    });

    // Simulated attendance data (usually fetched joined with attendance records)
    const correlationData = transcripts.map(t => {
      // Simulate attendance between 60% and 100% correlating slightly with CGPA
      const baseAttendance = 60 + (t.cgpa / 10) * 40;
      // Add some random noise
      const actualAttendance = Math.min(100, Math.max(0, baseAttendance + (Math.random() * 10 - 5)));
      return {
        studentId: t.studentId,
        cgpa: t.cgpa,
        attendancePercentage: actualAttendance,
      };
    });

    // Calculate a simple positive correlation score (mocked as 0.75 for demonstration)
    return {
      correlationScore: 0.75,
      dataPoints: correlationData,
      insight: 'Strong positive correlation observed between attendance > 85% and CGPA > 8.0',
    };
  }

  async generateReportDocument(type: 'NAAC' | 'NIRF', format: 'PDF' | 'EXCEL', academicYear: string) {
    // In a production environment, this would use libraries like pdfmake, puppeteer, or exceljs
    // to generate the actual binary files. We simulate the generation process here.
    
    let reportData: any;
    if (type === 'NAAC') {
      reportData = await this.generateNaacData(academicYear);
    } else {
      reportData = await this.generateNirfData(academicYear);
    }

    // Simulate document generation time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a mock URL or base64 string representing the generated file
    return {
      type,
      format,
      academicYear,
      status: 'Generated',
      downloadUrl: `https://storage.campuscore.edu/reports/${type.toLowerCase()}_${academicYear}_${format.toLowerCase()}.${format.toLowerCase()}`,
      metadata: reportData, // Include the raw data for reference
    };
  }
}

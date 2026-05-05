import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { Category, TransactionStatus } from '@campuscore/shared-constants';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createFeeStructure(dto: CreateFeeStructureDto): Promise<any> {
    const {
      programId,
      batchYear,
      category,
      academicYear,
      semester,
      feeHeads,
      dueDate,
      lateFeePerDay,
      installments,
    } = dto;

    // Calculate total amount
    const totalAmount = feeHeads.reduce((sum, head) => sum + head.amount, 0);

    return this.prisma.feeStructure.create({
      data: {
        programId,
        batchYear,
        category: category as any,
        academicYear,
        semester,
        feeHeads: feeHeads as any,
        totalAmount,
        dueDate: new Date(dueDate),
        lateFeePerDay,
        installments: installments as any,
      },
    });
  }

  async getFeeStructures(programId?: string, batchYear?: number): Promise<any> {
    return this.prisma.feeStructure.findMany({
      where: {
        ...(programId && { programId }),
        ...(batchYear && { batchYear }),
      },
    });
  }

  async generateFeesForStudent(studentId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { program: true },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Find applicable fee structure
    const feeStructure = await this.prisma.feeStructure.findFirst({
      where: {
        programId: student.programId,
        batchYear: student.batchYear,
        category: student.category as any,
        semester: student.currentSemester,
        isActive: true,
      },
    });

    if (!feeStructure) {
      console.warn(`No fee structure found for student ${studentId}`);
      return;
    }

    // Check if transaction already exists for this student and fee structure
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        studentId: student.id,
        feeStructureId: feeStructure.id,
      },
    });

    if (existingTransaction) {
      return existingTransaction;
    }

    // Create a new transaction (fee record)
    return this.prisma.transaction.create({
      data: {
        studentId: student.id,
        feeStructureId: feeStructure.id,
        amount: feeStructure.totalAmount,
        transactionId: `FEE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: TransactionStatus.INITIATED as any,
        paymentMethod: 'PENDING',
      },
    });
  }
}

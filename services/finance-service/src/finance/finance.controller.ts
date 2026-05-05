import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('fee-structure')
  createFeeStructure(@Body() dto: CreateFeeStructureDto): Promise<any> {
    return this.financeService.createFeeStructure(dto);
  }

  @Get('fee-structures')
  getFeeStructures(
    @Query('programId') programId?: string,
    @Query('batchYear') batchYear?: string,
  ): Promise<any> {
    return this.financeService.getFeeStructures(
      programId,
      batchYear ? parseInt(batchYear) : undefined,
    );
  }

  @Post('generate-fees/:studentId')
  generateFees(@Param('studentId') studentId: string): Promise<any> {
    return this.financeService.generateFeesForStudent(studentId);
  }
}

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { EmployeeService, LeaveRequestService } from '../services/hr.service';
import { CreateEmployeeDto, UpdateEmployeeDto, CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dtos/hr.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}

@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly leaveService: LeaveRequestService) {}

  @Post()
  submit(@Body() dto: CreateLeaveRequestDto, @Req() req: any) {
    // In a real app, employeeId would come from the JWT via req.user
    const employeeId = req.body.employeeId || req.user?.employeeId;
    return this.leaveService.submit(employeeId, dto);
  }

  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  @Get('employee/:id')
  findByEmployee(@Param('id') id: string) {
    return this.leaveService.findByEmployee(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @Req() req: any
  ) {
    // adminId from JWT
    const adminId = req.user?.id || 'system-admin';
    return this.leaveService.updateStatus(id, adminId, dto);
  }
}

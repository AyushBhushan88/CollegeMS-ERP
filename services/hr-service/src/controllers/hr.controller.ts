import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('employees')
export class EmployeeController {
  @Post()
  create(@Body() employeeData: any) {
    return { message: 'Employee created' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: 'John Doe' };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return { id, message: 'Employee updated' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { id, message: 'Employee deleted' };
  }
}

@Controller('leave-requests')
export class LeaveRequestController {
  @Post()
  create(@Body() leaveRequest: any) {
    return { message: 'Leave request submitted' };
  }
}

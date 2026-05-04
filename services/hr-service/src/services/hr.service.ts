import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  create(data: any) {
    return { id: '1', ...data };
  }

  findOne(id: string) {
    return { id, name: 'John Doe' };
  }

  update(id: string, data: any) {
    return { id, ...data };
  }

  remove(id: string) {
    return { id, deleted: true };
  }
}

@Injectable()
export class LeaveRequestService {
  submit(data: any) {
    return { id: '101', ...data, status: 'pending' };
  }
}

import { HostelType, RoomType, RoomStatus } from '@campuscore/shared-constants';

export interface Hostel {
  id: string;
  name: string;
  type: HostelType;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomAllocation {
  id: string;
  studentId: string;
  roomId: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

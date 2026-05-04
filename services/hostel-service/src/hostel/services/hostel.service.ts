import { Injectable } from '@nestjs/common';
import { CreateRoomDto, AllocateRoomDto } from '../dto/hostel.dto';

@Injectable()
export class HostelService {
  async createRoom(createRoomDto: CreateRoomDto) {
    // Logic for creating a room
    return { id: 'room-id', ...createRoomDto };
  }

  async allocateRoom(allocateRoomDto: AllocateRoomDto) {
    // Logic for room allocation
    return { id: 'allocation-id', ...allocateRoomDto };
  }
}

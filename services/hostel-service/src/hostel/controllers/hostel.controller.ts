import { Controller, Post, Body } from '@nestjs/common';
import { HostelService } from '../services/hostel.service';
import { CreateRoomDto, AllocateRoomDto } from '../dto/hostel.dto';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Post('rooms')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.hostelService.createRoom(createRoomDto);
  }

  @Post('allocations')
  async allocateRoom(@Body() allocateRoomDto: AllocateRoomDto) {
    return this.hostelService.allocateRoom(allocateRoomDto);
  }
}

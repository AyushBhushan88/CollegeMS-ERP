import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HostelService } from '../services/hostel.service';
import { CreateHostelDto, CreateRoomDto, AllocateRoomDto } from '../dto/hostel.dto';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Get('stats')
  async getStats() {
    return this.hostelService.getStats();
  }

  @Get('recent-allocations')
  async getRecentAllocations() {
    return this.hostelService.getRecentAllocations();
  }

  @Get()
  async findAllHostels() {
    return this.hostelService.findAllHostels();
  }

  @Get(':id')
  async findHostelDetails(@Param('id') id: string) {
    return this.hostelService.findHostelDetails(id);
  }

  @Post()
  async createHostel(@Body() dto: CreateHostelDto) {
    return this.hostelService.createHostel(dto);
  }

  @Post(':id/rooms')
  async addRoom(@Param('id') id: string, @Body() dto: CreateRoomDto) {
    return this.hostelService.addRoom(id, dto);
  }

  @Post('allocations')
  async allocateRoom(@Body() dto: AllocateRoomDto) {
    return this.hostelService.allocateRoom(dto);
  }
}

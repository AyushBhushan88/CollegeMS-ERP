import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { PlacementService } from './placement.service';
import { CreatePlacementDriveDto, ApplyDriveDto, UpdateApplicationStatusDto, RecordResultDto } from './dto/placement.dto';

@Controller('placement')
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Get('stats')
  async getStats() {
    return this.placementService.getStats();
  }

  @Get('drives')
  async findAllDrives() {
    return this.placementService.findAllDrives();
  }

  @Get('drives/:id')
  async findDriveDetails(@Param('id') id: string) {
    return this.placementService.findDriveDetails(id);
  }

  @Post('drives')
  async createDrive(@Body() dto: CreatePlacementDriveDto) {
    return this.placementService.createDrive(dto);
  }

  @Post('apply')
  async apply(@Body() dto: ApplyDriveDto) {
    return this.placementService.apply(dto);
  }

  @Put('applications/:id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.placementService.updateApplicationStatus(id, dto);
  }

  @Post('results')
  async recordResult(@Body() dto: RecordResultDto) {
    return this.placementService.recordResult(dto);
  }
}

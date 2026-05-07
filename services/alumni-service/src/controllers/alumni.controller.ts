import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AlumniService } from '../services/alumni.service';
import { MentorshipService } from '../services/mentorship.service';
import { DonationService } from '../services/donation.service';
import {
  RegisterAlumniClassDto,
  AlumniDirectoryFilterDto
} from '../dtos/alumni.dto';
import { DonationStatus } from '@campuscore/shared-constants';
import { RbacGuard, Roles } from '../guards/rbac.guard';

@Controller('alumni')
@UseGuards(RbacGuard)
export class AlumniController {
  constructor(
    private readonly alumniService: AlumniService,
    private readonly mentorshipService: MentorshipService,
    private readonly donationService: DonationService
  ) {}

  @Post('register')
  register(@Body() dto: RegisterAlumniClassDto) {
    return this.alumniService.register(dto);
  }

  @Patch(':id/verify')
  @Roles('admin')
  verify(@Param('id') id: string) {
    return this.alumniService.verifyProfile(id);
  }

  @Get('directory')
  findDirectory(@Query() filters: AlumniDirectoryFilterDto) {
    return this.alumniService.findDirectory(filters);
  }

  @Get('events')
  findAllEvents() {
    return this.alumniService.findAllEvents();
  }

  @Post('events')
  @Roles('admin')
  createEvent(@Body() body: any) {
    return this.alumniService.createEvent(body);
  }

  @Post('events/:id/register')
  registerForEvent(@Param('id') id: string, @Req() req: any) {
    const userId = req.headers['x-user-id'] || 'system-user';
    return this.alumniService.registerForEvent(id, userId);
  }

  @Post('mentorship/apply')
  applyForMentorship(@Body() body: { programId: string, alumniId: string, statement: string }) {
    return this.alumniService.applyForMentorship(body.programId, body.alumniId, body.statement);
  }

  @Get(':id/mentorship/matches')
  getMentorshipMatches(@Param('id') id: string) {
    return this.mentorshipService.generateMatches(id);
  }

  @Post('donations/initiate')
  initiateDonation(@Body() body: { alumniId: string; amount: number; purpose?: string; paymentMethod: string }) {
    return this.donationService.initiateDonation(body);
  }

  @Patch('donations/:id/verify')
  @Roles('admin')
  verifyDonation(@Param('id') id: string) {
    return this.donationService.verifyDonation(id);
  }

  @Patch('donations/:id/reject')
  @Roles('admin')
  rejectDonation(@Param('id') id: string) {
    return this.donationService.rejectDonation(id);
  }

  @Get('donations')
  getDonations(@Query('status') status?: DonationStatus, @Query('alumniId') alumniId?: string) {
    return this.donationService.getDonations({ status, alumniId });
  }

  @Get('donations/:id/receipt')
  getDonationReceipt(@Param('id') id: string) {
    return this.donationService.generateReceipt(id);
  }
}

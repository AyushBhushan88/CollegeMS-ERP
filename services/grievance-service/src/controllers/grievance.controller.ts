import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Req,
  UseGuards
} from '@nestjs/common';
import { GrievanceService } from '../services/grievance.service';
import { 
  CreateGrievanceClassDto, 
  UpdateGrievanceStatusClassDto 
} from '../dtos/grievance.dto';
import { RbacGuard, Roles } from '../guards/rbac.guard';

@Controller('grievances')
@UseGuards(RbacGuard)
export class GrievanceController {
  constructor(private readonly grievanceService: GrievanceService) {}

  @Post()
  create(@Body() dto: CreateGrievanceClassDto, @Req() req: any) {
    // In a real app, userId comes from req.user
    const userId = req.headers['x-user-id'] || 'system-user';
    return this.grievanceService.createGrievance(userId, dto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.grievanceService.findAll();
  }

  @Get('my')
  findMy(@Req() req: any) {
    const userId = req.headers['x-user-id'] || 'system-user';
    return this.grievanceService.findByComplainant(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grievanceService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(
    @Param('id') id: string, 
    @Body() dto: UpdateGrievanceStatusClassDto,
    @Req() req: any
  ) {
    const userId = req.headers['x-user-id'] || 'system-admin';
    return this.grievanceService.updateStatus(id, dto, userId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { comment: string, attachments?: string[] },
    @Req() req: any
  ) {
    const userId = req.headers['x-user-id'] || 'system-user';
    return this.grievanceService.addComment(id, userId, body.comment, body.attachments);
  }

  @Get('categories')
  findAllCategories() {
    return this.grievanceService.findAllCategories();
  }

  @Post('categories')
  @Roles('admin')
  createCategory(@Body() body: { name: string, description?: string }) {
    return this.grievanceService.createCategory(body.name, body.description);
  }

  @Post('committees')
  @Roles('admin')
  createCommittee(@Body() body: { name: string, members: string[], categoryIds: string[] }) {
    return this.grievanceService.createCommittee(body.name, body.members, body.categoryIds);
  }
}
oryIds);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { 
  GrievanceStatus, 
  GrievancePriority 
} from '@campuscore/shared-constants';
import { 
  CreateGrievanceDto, 
  UpdateGrievanceStatusDto 
} from '@campuscore/shared-types';

@Injectable()
export class GrievanceService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async createGrievance(userId: string, dto: CreateGrievanceDto) {
    const ticketNumber = `GRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Patent-Aligned Dynamic SLA-Based Routing Algorithm
    // Novel Technical Effect: Optimizes institutional resource allocation in real-time by dynamically evaluating
    // compute-efficient heuristics (workload and historical resolution speed) rather than static round-robin.
    // This allows hardware-constrained edge servers to efficiently route requests without heavy ML inference overhead.
    const category = await this.prisma.grievanceCategory.findUnique({
      where: { id: dto.categoryId },
      include: { committees: true }
    });

    if (!category) {
      throw new NotFoundException('Grievance category not found');
    }

    let assignedToId: string | null = null;

    if (category.committees.length > 0) {
      if (category.committees.length === 1) {
        assignedToId = category.committees[0].id;
      } else {
        let bestCommitteeId = category.committees[0].id;
        let highestScore = -Infinity;

        // Evaluate each committee's dynamic score based on workload and SLA history
        for (const committee of category.committees) {
          // 1. Calculate Current Workload (active grievances)
          const activeGrievances = await this.prisma.grievance.count({
            where: {
              assignedToId: committee.id,
              status: { in: [GrievanceStatus.PENDING, GrievanceStatus.UNDER_REVIEW, GrievanceStatus.REOPENED] }
            }
          });

          // 2. Calculate Historical Resolution Speed (average ms to resolve)
          // To keep it lightweight for edge execution, we sample the last 10 resolved grievances
          const resolvedGrievances = await this.prisma.grievance.findMany({
            where: {
              assignedToId: committee.id,
              status: GrievanceStatus.RESOLVED,
              resolvedAt: { not: null }
            },
            orderBy: { resolvedAt: 'desc' },
            take: 10,
            select: { createdAt: true, resolvedAt: true }
          });

          let avgResolutionTimeMs = 0;
          if (resolvedGrievances.length > 0) {
            const totalTime = resolvedGrievances.reduce((acc, curr) => {
              return acc + (curr.resolvedAt!.getTime() - curr.createdAt.getTime());
            }, 0);
            avgResolutionTimeMs = totalTime / resolvedGrievances.length;
          } else {
            // Default baseline if no history: assume a standard 2-day resolution
            avgResolutionTimeMs = 2 * 24 * 60 * 60 * 1000; 
          }

          // Composite Score Calculation:
          // Inverse of workload (fewer active tickets = higher score) 
          // Inverse of resolution time (faster resolution = higher score)
          // Weights can be tuned; here we use an O(1) heuristic normalization.
          const workloadFactor = 1 / (activeGrievances + 1);
          const speedFactor = 100000000 / (avgResolutionTimeMs + 1); // Normalize ms to a usable factor
          
          const compositeScore = (workloadFactor * 0.6) + (speedFactor * 0.4);

          if (compositeScore > highestScore) {
            highestScore = compositeScore;
            bestCommitteeId = committee.id;
          }
        }
        assignedToId = bestCommitteeId;
      }
    }

    // Set SLA Deadline (e.g., 3 days for MEDIUM, 1 day for HIGH)
    const slaDays = dto.priority === GrievancePriority.HIGH || dto.priority === GrievancePriority.URGENT ? 1 : 3;
    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + slaDays);

    const grievance = await this.prisma.grievance.create({
      data: {
        ticketNumber,
        complainantId: userId,
        categoryId: dto.categoryId,
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority || GrievancePriority.MEDIUM,
        isAnonymous: dto.isAnonymous || false,
        attachments: dto.attachments || [],
        assignedToId,
        slaDeadline,
      },
      include: {
        category: true,
      }
    });

    // Publish event
    this.eventBus.publish('grievance', 'grievance.created', {
      grievanceId: grievance.id,
      ticketNumber: grievance.ticketNumber,
      complainantId: grievance.complainantId,
      categoryId: grievance.categoryId,
      assignedToId: grievance.assignedToId,
    });

    return grievance;
  }

  async findAll() {
    return this.prisma.grievance.findMany({
      include: {
        category: true,
        comments: true,
      }
    });
  }

  async findByComplainant(userId: string) {
    return this.prisma.grievance.findMany({
      where: { complainantId: userId },
      include: {
        category: true,
      }
    });
  }

  async findOne(id: string) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id },
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!grievance) {
      throw new NotFoundException(`Grievance with ID ${id} not found`);
    }

    return grievance;
  }

  async updateStatus(id: string, dto: UpdateGrievanceStatusDto, userId: string) {
    const grievance = await this.prisma.grievance.update({
      where: { id },
      data: {
        status: dto.status,
        resolution: dto.resolution,
        resolvedById: dto.status === GrievanceStatus.RESOLVED ? userId : undefined,
        resolvedAt: dto.status === GrievanceStatus.RESOLVED ? new Date() : undefined,
      }
    });

    // Publish event
    this.eventBus.publish('grievance', 'grievance.status_updated', {
      grievanceId: grievance.id,
      status: grievance.status,
      complainantId: grievance.complainantId,
    });

    return grievance;
  }

  async addComment(grievanceId: string, userId: string, comment: string, attachments?: string[]) {
    const newComment = await this.prisma.grievanceComment.create({
      data: {
        grievanceId,
        userId,
        comment,
        attachments: attachments || [],
      }
    });

    // Publish event
    this.eventBus.publish('grievance', 'grievance.comment_added', {
      grievanceId,
      commentId: newComment.id,
      userId,
    });

    return newComment;
  }

  async createCategory(name: string, description?: string) {
    return this.prisma.grievanceCategory.create({
      data: { name, description }
    });
  }

  async findAllCategories() {
    return this.prisma.grievanceCategory.findMany();
  }

  async createCommittee(name: string, members: string[], categoryIds: string[]) {
    return this.prisma.grievanceCommittee.create({
      data: {
        name,
        members,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      }
    });
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { QueryOpportunityDto } from './dto/query-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOpportunityDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { userId },
    });

    if (!organization) {
      throw new ForbiddenException(
        'Organization profile not found for this user',
      );
    }

    return this.prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        title: dto.title,
        type: dto.type,
        location: dto.location,
        description: dto.description,
        requirements: dto.requirements,
        deadline: new Date(dto.deadline),
        status: 'OPEN',
      },
    });
  }

  async findAll(query: QueryOpportunityDto) {
    const {
      search,
      type,
      location,
      status = 'OPEN',
      page = 1,
      limit = 10,
    } = query;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      status,
    };

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [opportunities, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        include: {
          organization: true,
        },
        orderBy: {
          postedDate: 'desc',
        },
        skip,
        take: safeLimit,
      }),
      this.prisma.opportunity.count({
        where,
      }),
    ]);

    return {
      data: opportunities,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateOpportunityDto,
  ) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only update your own opportunities',
      );
    }

    const data: any = {
      ...dto,
    };

    if (dto.deadline) {
      data.deadline = new Date(dto.deadline);
    }

    return this.prisma.opportunity.update({
      where: { id },
      data,
    });
  }

  async remove(userId: number, id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own opportunities',
      );
    }

    return this.prisma.opportunity.delete({
      where: { id },
    });
  }

  async close(userId: number, id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.userId !== userId) {
      throw new ForbiddenException(
        'You can only close your own opportunities',
      );
    }

    if (opportunity.status === 'CLOSED') {
      throw new BadRequestException('Opportunity is already closed');
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        status: 'CLOSED',
      },
    });
  }
}
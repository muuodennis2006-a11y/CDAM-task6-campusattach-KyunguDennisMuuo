import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, students, organizations, opportunities, pendingOpportunities, activeUsers, inactiveUsers, applications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'ORGANIZATION' } }),
      this.prisma.opportunity.count(),
      this.prisma.opportunity.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.application.count(),
    ]);
    return { totalUsers, students, organizations, opportunities, pendingOpportunities, activeUsers, inactiveUsers, applications };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateUserStatus(id: number, isActive: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getOpportunities() {
    return this.prisma.opportunity.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateOpportunityStatus(
    id: number,
    status: 'OPEN' | 'CLOSED' | 'PENDING' | 'REJECTED',
  ) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: { status },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  }
}

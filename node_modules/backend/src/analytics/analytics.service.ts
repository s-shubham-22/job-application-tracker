import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication, ApplicationStatus } from '../jobs/entities/job-application.entity';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobsRepo: Repository<JobApplication>,
  ) {}

  async getSummary(userId: string) {
    const results = await this.jobsRepo
      .createQueryBuilder('job')
      .select('job.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('job.user.id = :userId', { userId })
      .groupBy('job.status')
      .getRawMany();

    const byStatus: Record<string, number> = Object.values(
      ApplicationStatus,
    ).reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<string, number>,
    );

    results.forEach((row) => {
      byStatus[row.status] = parseInt(row.count, 10);
    });

    const total = Object.values(byStatus).reduce((sum, v) => sum + v, 0);

    const responded =
      (byStatus.SCREENING || 0) +
      (byStatus.INTERVIEW || 0) +
      (byStatus.OFFER || 0) +
      (byStatus.REJECTED || 0);

    const responseRate =
      total > 0 ? `${((responded / total) * 100).toFixed(1)}%` : '0%';
    const offerRate =
      total > 0
        ? `${(((byStatus.OFFER || 0) / total) * 100).toFixed(1)}%`
        : '0%';

    return { total, byStatus, responseRate, offerRate };
  }

  async getTimeline(userId: string) {
    const months: { month: string; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const result = await this.jobsRepo
        .createQueryBuilder('job')
        .select('COUNT(*)', 'count')
        .where('job.user.id = :userId', { userId })
        .andWhere('job.appliedAt >= :start', { start })
        .andWhere('job.appliedAt <= :end', { end })
        .getRawOne();

      months.push({
        month: format(date, 'MMM yyyy'),
        count: parseInt(result?.count || '0', 10),
      });
    }

    return months;
  }
}

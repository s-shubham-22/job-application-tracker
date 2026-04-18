import {
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { JobApplication } from './entities/job-application.entity';
import { Company } from './entities/company.entity';
import { StatusHistory } from './entities/status-history.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { ActivityLog } from '../notes/schemas/activity-log.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobsRepo: Repository<JobApplication>,
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
    @InjectRepository(StatusHistory)
    private readonly statusHistoryRepo: Repository<StatusHistory>,
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLog>,
  ) {}

  async createJob(userId: string, dto: CreateJobDto): Promise<JobApplication> {
    // Upsert company by name
    let company = await this.companiesRepo.findOne({
      where: { name: dto.companyName },
    });
    if (!company) {
      company = await this.companiesRepo.save(
        this.companiesRepo.create({
          name: dto.companyName,
          website: dto.companyWebsite,
          location: dto.companyLocation,
        }),
      );
    }

    const job = this.jobsRepo.create({
      jobTitle: dto.jobTitle,
      jobUrl: dto.jobUrl,
      salary: dto.salary,
      location: dto.location,
      description: dto.description,
      status: dto.status,
      followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
      company,
      user: { id: userId },
    });

    const saved = await this.jobsRepo.save(job);

    // Log activity in MongoDB
    await this.activityLogModel.create({
      jobApplicationId: saved.id,
      userId,
      action: 'JOB_CREATED',
      metadata: { jobTitle: dto.jobTitle, companyName: dto.companyName, status: saved.status },
    });

    return saved;
  }

  async findAll(userId: string, query: QueryJobsDto) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'appliedAt',
      sortOrder = 'DESC',
    } = query;

    const validSortColumns = ['appliedAt', 'updatedAt', 'jobTitle', 'status'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'appliedAt';

    const qb = this.jobsRepo
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.user.id = :userId', { userId });

    if (status) {
      qb.andWhere('job.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(job.jobTitle) LIKE :search OR LOWER(company.name) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    qb.orderBy(`job.${safeSortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, id: string): Promise<JobApplication> {
    const job = await this.jobsRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['company', 'statusHistory', 'user'],
    });
    if (!job) {
      throw new NotFoundException('Job application not found');
    }
    // Sort status history chronologically
    if (job.statusHistory) {
      job.statusHistory.sort(
        (a, b) =>
          new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime(),
      );
    }
    return job;
  }

  async update(userId: string, id: string, dto: UpdateJobDto): Promise<JobApplication> {
    const job = await this.findOne(userId, id);

    if (dto.companyName && dto.companyName !== job.company.name) {
      let company = await this.companiesRepo.findOne({
        where: { name: dto.companyName },
      });
      if (!company) {
        company = await this.companiesRepo.save(
          this.companiesRepo.create({
            name: dto.companyName,
            website: dto.companyWebsite,
            location: dto.companyLocation,
          }),
        );
      }
      job.company = company;
    }

    Object.assign(job, {
      jobTitle: dto.jobTitle ?? job.jobTitle,
      jobUrl: dto.jobUrl ?? job.jobUrl,
      salary: dto.salary ?? job.salary,
      location: dto.location ?? job.location,
      description: dto.description ?? job.description,
      followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : job.followUpDate,
    });

    return this.jobsRepo.save(job);
  }

  async updateStatus(
    userId: string,
    id: string,
    dto: UpdateStatusDto,
  ): Promise<JobApplication> {
    const job = await this.findOne(userId, id);

    const fromStatus = job.status;
    job.status = dto.status;

    // Record status history
    const history = this.statusHistoryRepo.create({
      jobApplication: job,
      fromStatus,
      toStatus: dto.status,
      note: dto.note,
    });
    await this.statusHistoryRepo.save(history);

    // Log activity
    await this.activityLogModel.create({
      jobApplicationId: id,
      userId,
      action: 'STATUS_CHANGED',
      metadata: {
        fromStatus,
        toStatus: dto.status,
        note: dto.note,
      },
    });

    // Reset reminder if status changes
    if (job.reminderSent) {
      job.reminderSent = false;
    }

    return this.jobsRepo.save(job);
  }

  async remove(userId: string, id: string): Promise<void> {
    const job = await this.findOne(userId, id);
    await this.jobsRepo.remove(job);
  }

  async getActivityLogs(userId: string, jobId: string) {
    return this.activityLogModel
      .find({ jobApplicationId: jobId, userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async exportToExcel(userId: string): Promise<StreamableFile> {
    const { items } = await this.findAll(userId, { page: 1, limit: 10000 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Job Application Tracker';
    const sheet = workbook.addWorksheet('Applications');

    sheet.columns = [
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Salary', key: 'salary', width: 20 },
      { header: 'Job URL', key: 'jobUrl', width: 40 },
      { header: 'Applied At', key: 'appliedAt', width: 20 },
      { header: 'Follow Up Date', key: 'followUpDate', width: 20 },
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    items.forEach((job) => {
      sheet.addRow({
        jobTitle: job.jobTitle,
        company: job.company?.name || '',
        status: job.status,
        location: job.location || '',
        salary: job.salary || '',
        jobUrl: job.jobUrl || '',
        appliedAt: job.appliedAt
          ? new Date(job.appliedAt).toLocaleDateString()
          : '',
        followUpDate: job.followUpDate
          ? new Date(job.followUpDate).toLocaleDateString()
          : '',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new StreamableFile(Buffer.from(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename="job-applications.xlsx"',
    });
  }
}

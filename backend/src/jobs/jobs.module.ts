import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { JobApplication } from './entities/job-application.entity';
import { StatusHistory } from './entities/status-history.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ActivityLog, ActivityLogSchema } from '../notes/schemas/activity-log.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, Company, StatusHistory]),
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService, TypeOrmModule],
})
export class JobsModule {}

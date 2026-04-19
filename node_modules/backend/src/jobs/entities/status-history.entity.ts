import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './job-application.entity';
import { ApplicationStatus } from './application-status.enum';

@Entity('status_history')
export class StatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobApplication, (job) => job.statusHistory, {
    onDelete: 'CASCADE',
  })
  jobApplication: JobApplication;

  @Column({ type: 'enum', enum: ApplicationStatus })
  fromStatus: ApplicationStatus;

  @Column({ type: 'enum', enum: ApplicationStatus })
  toStatus: ApplicationStatus;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @CreateDateColumn()
  changedAt: Date;
}

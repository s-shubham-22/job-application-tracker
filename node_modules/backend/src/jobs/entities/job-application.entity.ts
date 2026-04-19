import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from './company.entity';
import { StatusHistory } from './status-history.entity';
export { ApplicationStatus } from './application-status.enum';
import { ApplicationStatus } from './application-status.enum';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.jobApplications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Company, (company) => company.jobApplications, {
    eager: true,
  })
  company: Company;

  @Column()
  jobTitle: string;

  @Column({ nullable: true })
  jobUrl: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'date' })
  followUpDate: Date;

  @Column({ default: false })
  reminderSent: boolean;

  @CreateDateColumn()
  appliedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StatusHistory, (sh) => sh.jobApplication, { cascade: true })
  statusHistory: StatusHistory[];
}

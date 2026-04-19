import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../entities/job-application.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.INTERVIEW })
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;

  @ApiPropertyOptional({ example: 'Got a call from the recruiter!' })
  @IsString()
  @IsOptional()
  note?: string;
}

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../entities/job-application.entity';

export class CreateJobDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsUrl({}, { message: 'Company website must be a valid URL' })
  @IsOptional()
  companyWebsite?: string;

  @ApiPropertyOptional({ example: 'Mountain View, CA' })
  @IsString()
  @IsOptional()
  companyLocation?: string;

  @ApiPropertyOptional({ example: 'https://careers.google.com/...' })
  @IsOptional()
  @IsString()
  jobUrl?: string;

  @ApiPropertyOptional({ example: '$120,000 - $150,000' })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiPropertyOptional({ example: 'Remote' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Exciting SWE role on the SecOps team.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsDateString()
  @IsOptional()
  followUpDate?: string;
}

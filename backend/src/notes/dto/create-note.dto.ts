import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'Technical Round 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Asked about system design...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    enum: ['PHONE_SCREEN', 'TECHNICAL', 'HR', 'GENERAL', 'FOLLOW_UP'],
    default: 'GENERAL',
  })
  @IsEnum(['PHONE_SCREEN', 'TECHNICAL', 'HR', 'GENERAL', 'FOLLOW_UP'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: '2026-04-20' })
  @IsDateString()
  @IsOptional()
  interviewDate?: string;
}

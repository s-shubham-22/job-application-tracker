import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get application counts by status with rates' })
  getSummary(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getSummary(user.id);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get application count per month for last 6 months' })
  getTimeline(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getTimeline(user.id);
  }
}

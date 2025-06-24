import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  JwtPayload,
} from '../common/decorators/current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('adminstats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async adminstats() {
    const data = await this.statsService.getAdminStats();
    return { message: 'Admin Stats fetched Succesfully', data };
  }

  @Get('userstats')
  @UseGuards(JwtAuthGuard)
  async userstats(@CurrentUser() user: JwtPayload) {
    const data = await this.statsService.getUserStats(user.userId);
    return { message: 'User Stats fetched Succesfully', data };
  }
}

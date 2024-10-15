// File: src/engagement/engagement.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { EngagementService } from './engagement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEngagementDto } from './dto/create-engagement.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@UseGuards(JwtAuthGuard)
@Controller('engagements')
export class EngagementController {
  constructor(
    private readonly engagementService: EngagementService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async getEngagements(@Request() req) {
    this.logger.info(`Fetching engagements for user: ${req.user.email}`);
    const engagements = await this.engagementService.getEngagementsForUser(req.user);
    this.logger.info(`Engagements fetched: ${JSON.stringify(engagements)}`);
    return engagements;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createEngagement(
    @Body() createEngagementDto: CreateEngagementDto,
    @Request() req,
  ) {
    const { name, client, userIds } = createEngagementDto;
    this.logger.info(`Creating engagement: ${name} for client ${client}`);
    return await this.engagementService.createEngagement(name, client, userIds, req.user);
  }

  @Delete(':id')
  async deleteEngagement(@Param('id') id: string, @Request() req) {
    this.logger.info(`Deleting engagement with ID: ${id}`);
    await this.engagementService.deleteEngagement(id, req.user);
    return { message: 'Engagement deleted successfully' };
  }
}

// src/engagement/engagement.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Engagement } from './engagement.entity';
import { EngagementService } from './engagement.service';
import { EngagementController } from './engagement.controller';
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Engagement]),
    UserModule, 
  ],
  providers: [EngagementService],
  controllers: [EngagementController],
})
export class EngagementModule {}

// File: backend/src/infrastructure/ansible/ansible.controller.ts

import { Controller, Get, Post, Delete, Body, Param, Req, Logger, UseGuards } from '@nestjs/common';
import { AnsibleService } from './ansible.service';
import { AnsiblePlaybook } from './ansible-playbook.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ansible')
export class AnsibleController {
  private readonly logger = new Logger(AnsibleController.name); // Initialize logger

  constructor(private readonly ansibleService: AnsibleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  async createPlaybook(
    @Body() playbookData: { playbook: AnsiblePlaybook },
    @Req() request: Request,
  ) {
    const playbook = playbookData.playbook;
  
    if (!playbook) {
      throw new Error('Missing playbook data.');
    }
  
    const user = request.user as { id: string };
  
    // Ensure user exists
    if (!user || !user.id) {
      this.logger.error('User not authenticated or user ID is missing.');
      throw new Error('User not authenticated.');
    }
  
    playbook.created_by = user.id;
  
    this.logger.log(`Creating playbook for user ID: ${user.id}`);
    
    try {
      const savedPlaybook = await this.ansibleService.createPlaybook(playbook);
      this.logger.log('Playbook created successfully');
      return savedPlaybook;
    } catch (error) {
      this.logger.error(`Failed to create playbook: ${error.message}`);
      throw error;
    }
  }

  @Get('playbooks')
  async getAllPlaybooks() {
    this.logger.log('Fetching all playbooks');
    return await this.ansibleService.getAllPlaybooks();
  }

  @Delete(':id')
  async deletePlaybook(@Param('id') id: string) {
    this.logger.log(`Deleting playbook with ID: ${id}`);
    return await this.ansibleService.deletePlaybook(id);
  }  
}

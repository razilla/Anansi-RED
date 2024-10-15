// File: src/engagement/engagement.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Engagement } from './engagement.entity';
import { User } from '../user/user.entity';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Engagement)
    private readonly engagementRepository: Repository<Engagement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new engagement
  async createEngagement(
    name: string,
    client: string,
    userIds: string[],
    createdBy: User,
  ): Promise<Engagement> {
    // Validate that all userIds correspond to existing users
    const users = await this.userRepository.findBy({
      id: In(userIds),
    }); // Use findBy with the In operator instead of findByIds

    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    const engagement = this.engagementRepository.create({
      name,
      client,
      userIds,
      createdBy,
    });

    return await this.engagementRepository.save(engagement);
  }

  // Get engagements for a user
  async getEngagementsForUser(user: User): Promise<Engagement[]> {
    if (user.role === 'admin') {
      console.log('Fetching engagements for admin user:', user);
      return await this.engagementRepository.find();
    } else {
      // Find engagements where userIds array contains the user's ID
      return await this.engagementRepository
        .createQueryBuilder('engagement')
        .where(':userId = ANY(engagement.userIds)', { userId: user.id })
        .getMany();
    }
  }

  // Delete an engagement
  async deleteEngagement(id: string, user: User): Promise<void> {
    const engagement = await this.engagementRepository.findOne({ where: { id } });

    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }

    // Only admin or the engagement creator can delete the engagement
    if (user.role !== 'admin' && engagement.createdBy.id !== user.id) {
      throw new UnauthorizedException('You do not have permission to delete this engagement');
    }

    await this.engagementRepository.remove(engagement);
  }
}

// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Find all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Find user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return user;
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
    const newUser = this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  // Update a user
  async update(id: string, userData: Partial<User>): Promise<User> {
    if (userData.passwordHash) {
      userData.passwordHash = await bcrypt.hash(userData.passwordHash, 10);
    }
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  // Delete a user
  async remove(id: string): Promise<void> {
    const deleteResult: DeleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
  }

  // Find user by email
async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  // Additional methods can be added here
}

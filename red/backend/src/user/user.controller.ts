// src/user/user.controller.ts

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UsePipes,
    ValidationPipe,
    ParseUUIDPipe,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { User } from './user.entity';
  import { CreateUserDto, UpdateUserDto } from './user.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    // Get the profile of the currently authenticated user
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req): Promise<User> {
      const userId = req.user.id;
      return await this.userService.findOne(userId);
    }
  
    // Get all users
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers(): Promise<User[]> {
      return await this.userService.findAll();
    }
  
    // Get a user by ID
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
      return await this.userService.findOne(id);
    }
  
    // Create a new user
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
      return await this.userService.create(createUserDto);
    }
  
    // Update a user
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':id')
    async updateUser(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
      return await this.userService.update(id, updateUserDto);
    }
  
    // Delete a user
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
      await this.userService.remove(id);
    }
  }
  
// src/user/user.dto.ts

import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 255)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 255)
  passwordHash: string;

  @IsString()
  @Length(1, 50)
  role: string;

  @IsOptional()
  infrastructure?: any;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 255)
  passwordHash?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  role?: string;

  @IsOptional()
  infrastructure?: any;
}

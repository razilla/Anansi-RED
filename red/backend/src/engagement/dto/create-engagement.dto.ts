// src/engagement/dto/create-engagement.dto.ts

import { IsString, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEngagementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  client: string;

  @IsArray()
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  userIds: string[];
}

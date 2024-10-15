// src/user/user.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    OneToMany,
  } from 'typeorm';
  import { v4 as uuidv4 } from 'uuid';
  
  @Entity('users')
  @Unique(['email'])
  @Unique(['username'])
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    username: string;
  
    @Column({ type: 'varchar', length: 255 })
    email: string;
  
    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash: string;
  
    @Column({ type: 'varchar', length: 50 })
    role: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @Column({ type: 'jsonb', nullable: true })
    infrastructure: any;
  
    // Relationships with other entities can be added here if needed
    // Example:
    // @OneToMany(() => Campaign, (campaign) => campaign.createdBy)
    // campaigns: Campaign[];
  }
  
// File: backend/src/infrastructure/terraform/terraform-set.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TerraformScriptFile } from './terraform-script-file.entity';

@Entity('terraform_sets')
export class TerraformSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ name: 'cloud_provider', length: 50 })
  cloudProvider: string;

  @Column('varchar', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => TerraformScriptFile, (scriptFile) => scriptFile.terraformSet, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  scripts: TerraformScriptFile[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


// File: backend/src/infrastructure/terraform/terraform-script-file.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TerraformSet } from './terraform-set.entity';

@Entity('terraform_script_files')
export class TerraformScriptFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TerraformSet, (terraformSet) => terraformSet.scripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'terraform_set_id' })
  terraformSet: TerraformSet;
  

  @Column({ name: 'name', length: 255 })
  name: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

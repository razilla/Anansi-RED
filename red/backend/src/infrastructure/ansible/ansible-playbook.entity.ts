// File: backend/src/infrastructure/ansible/ansible.playbook.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ansible_playbooks') // Specify table name if necessary
export class AnsiblePlaybook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  playbook: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Add this column to store the playbook file path
  @Column({ type: 'text', nullable: true })
  file_path: string;

  // Add this column to store inventory info (optional)
  @Column({ type: 'text', nullable: true })
  inventory: string;
}

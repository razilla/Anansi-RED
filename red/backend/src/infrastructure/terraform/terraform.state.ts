// File: backend/src/infrastructure/terraform/terraform.state.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TerraformState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instanceId: string;

  @Column('json')
  stateData: any;

  @Column('json', { nullable: true })
  outputs: any;

  @Column()
  status: string; // pending, running, completed, failed
}

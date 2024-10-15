// File: backend/src/infrastructure/ansible/ansible.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnsibleService } from './ansible.service';
import { AnsibleController } from './ansible.controller';
import { AnsiblePlaybook } from './ansible-playbook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnsiblePlaybook])],
  controllers: [AnsibleController],
  providers: [AnsibleService],
})
export class AnsibleModule {}

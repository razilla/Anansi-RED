// File: backend/src/infrastructure/ansible/ansible.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnsiblePlaybook } from './ansible-playbook.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AnsibleService {
  private readonly logger = new Logger(AnsibleService.name);
  private readonly playbookDirectory = path.join(__dirname, '..', '..', '..', 'playbooks');

  constructor(
    @InjectRepository(AnsiblePlaybook)
    private ansiblePlaybookRepository: Repository<AnsiblePlaybook>,
  ) {}

  // Create a playbook
async createPlaybook(playbook: AnsiblePlaybook): Promise<AnsiblePlaybook> {
  try {
    this.logger.log(`Received Playbook Data: ${JSON.stringify(playbook)}`);
  
    // Ensure the playbook directory exists and is writable
    if (!fs.existsSync(this.playbookDirectory)) {
      this.logger.log(`Creating playbook directory at: ${this.playbookDirectory}`);
      try {
        fs.mkdirSync(this.playbookDirectory, { recursive: true });
      } catch (mkdirError) {
        this.logger.error(`Failed to create playbook directory: ${mkdirError.message}`);
        throw new InternalServerErrorException('Failed to create playbook directory.');
      }
    }
  
    // Test if directory is writable
    try {
      fs.accessSync(this.playbookDirectory, fs.constants.W_OK);
    } catch (accessError) {
      this.logger.error(`Directory not writable: ${accessError.message}`);
      throw new InternalServerErrorException('Directory not writable.');
    }
  
    // Save the playbook content as a file
    const playbookFilename = `${playbook.name.replace(/\s+/g, '_')}_${Date.now()}.yml`;
    const playbookPath = path.join(this.playbookDirectory, playbookFilename);
    this.logger.log(`Saving playbook to path: ${playbookPath}`);
  
    // Try writing to the file system
    try {
      fs.writeFileSync(playbookPath, playbook.playbook);
    } catch (fsError) {
      this.logger.error(`Failed to write playbook file: ${fsError.message}`);
      throw new InternalServerErrorException('Failed to write playbook file.');
    }
  
    // Update the playbook entity to store the file path
    playbook.file_path = playbookPath;
  
    // Try saving to the database
    this.logger.log(`Saving playbook metadata to the database with playbook: ${JSON.stringify(playbook)}`);
    try {
      const savedPlaybook = await this.ansiblePlaybookRepository.save(playbook);
      this.logger.log(`Playbook saved successfully with ID: ${savedPlaybook.id}`);
      return savedPlaybook;
    } catch (dbError) {
      this.logger.error(`Failed to save playbook in database: ${dbError.message}`);
      throw new InternalServerErrorException('Failed to save playbook in the database.');
    }
  
  } catch (error) {
    this.logger.error(`Unexpected Error: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Failed to create Ansible playbook.');
  }
}


  // Retrieve all Ansible playbooks
  async getAllPlaybooks(): Promise<AnsiblePlaybook[]> {
    try {
      return await this.ansiblePlaybookRepository.find();
    } catch (error) {
      this.logger.error(`Failed to retrieve Ansible playbooks: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve Ansible playbooks.');
    }
  }

  // Delete a playbook by ID
  async deletePlaybook(id: string): Promise<void> {
    try {
      const playbook = await this.ansiblePlaybookRepository.findOne({ where: { id } });
      if (!playbook) {
        throw new Error('Ansible playbook not found.');
      }
  
      // Delete the playbook file if it exists
      if (playbook.file_path && fs.existsSync(playbook.file_path)) {
        fs.unlinkSync(playbook.file_path);
      }
  
      await this.ansiblePlaybookRepository.remove(playbook);
    } catch (error) {
      this.logger.error(`Failed to delete Ansible playbook: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete Ansible playbook.');
    }
  }  
}

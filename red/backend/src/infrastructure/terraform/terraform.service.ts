// File: backend/src/infrastructure/terraform/terraform.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerraformSet } from './terraform-set.entity';
import { TerraformScriptFile } from './terraform-script-file.entity';

@Injectable()
export class TerraformService {
  private readonly logger = new Logger(TerraformService.name);

  constructor(
    @InjectRepository(TerraformSet)
    private terraformSetRepository: Repository<TerraformSet>,

    @InjectRepository(TerraformScriptFile)
    private terraformScriptFileRepository: Repository<TerraformScriptFile>,
  ) {}

  async createTerraformSet(terraformSet: TerraformSet, scripts: TerraformScriptFile[]): Promise<TerraformSet> {
    try {
      console.log('Received Terraform Set:', terraformSet);
      console.log('Received Scripts:', scripts);
  
      // Save the Terraform set first
      const savedSet = await this.terraformSetRepository.save(terraformSet);
  
      // Save each script, associating it with the saved Terraform set
      for (const script of scripts) {
        if (!script.name) {
          throw new Error('Script name is required');
        }
        script.terraformSet = savedSet;
        await this.terraformScriptFileRepository.save(script);
      }
  
      // Fetch the complete set with the saved scripts
      const completeSet = await this.terraformSetRepository.findOne({
        where: { id: savedSet.id },
        relations: ['scripts'],
      });
  
      return completeSet;
    } catch (error) {
      this.logger.error(`Failed to create Terraform set: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create Terraform set.');
    }
  }
  


  // Get all Terraform sets including related scripts
  async getAllTerraformSets(): Promise<TerraformSet[]> {
    try {
      return await this.terraformSetRepository.find({
        relations: ['scripts'],
      });
    } catch (error) {
      this.logger.error(`Failed to retrieve Terraform sets: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve Terraform sets.');
    }
  }

// Delete a Terraform set by ID
async deleteTerraformSet(id: string): Promise<void> {
  try {
    const result = await this.terraformSetRepository.findOne({
      where: { id },
      relations: ['scripts'],
    });
    if (!result) {
      throw new Error('Terraform set not found.');
    }
    await this.terraformSetRepository.remove(result);
  } catch (error) {
    this.logger.error(`Failed to delete Terraform set: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Failed to delete Terraform set.');
  }
}

}

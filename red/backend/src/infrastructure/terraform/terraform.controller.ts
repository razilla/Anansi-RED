// File: backend/src/infrastructure/terraform/terraform.controller.ts

import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TerraformService } from './terraform.service';
import { TerraformSet } from './terraform-set.entity';
import { TerraformScriptFile } from './terraform-script-file.entity';

@Controller('terraform')
export class TerraformController {
  constructor(private readonly terraformService: TerraformService) {}

  @Post('upload')
  async createSet(
    @Body() data: { terraformSet: TerraformSet; scripts: TerraformScriptFile[] },
  ) {
    if (!data.terraformSet || !data.scripts) {
      throw new Error('Missing Terraform set or scripts data.');
    }
  
    const savedSet = await this.terraformService.createTerraformSet(data.terraformSet, data.scripts);
    return savedSet; // Ensure the saved set is returned, including the ID
  }
  

  @Get('sets')
  async getAllSets() {
    return await this.terraformService.getAllTerraformSets();
  }

  @Delete(':id')
  async deleteSet(@Param('id') id: string) {
    return await this.terraformService.deleteTerraformSet(id);
  }
}

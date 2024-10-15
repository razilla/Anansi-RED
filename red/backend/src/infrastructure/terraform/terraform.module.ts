// File: backend/src/infrastructure/terraform/terraform.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerraformService } from './terraform.service';
import { TerraformController } from './terraform.controller';
import { TerraformSet } from './terraform-set.entity';
import { TerraformScriptFile } from './terraform-script-file.entity'; // Import TerraformScriptFile entity

@Module({
  imports: [TypeOrmModule.forFeature([TerraformSet, TerraformScriptFile])],
  controllers: [TerraformController], 
  providers: [TerraformService],
})
export class TerraformModule {}

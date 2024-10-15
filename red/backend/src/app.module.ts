// File: src/app.module.ts

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EngagementModule } from './engagement/engagement.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TerraformModule } from './infrastructure/terraform/terraform.module';
import { AnsibleModule } from './infrastructure/ansible/ansible.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'red',
      database: 'red',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Do not synchronize with existing database
    }),
    UserModule,
    AuthModule,
    EngagementModule,
    TerraformModule,
    AnsibleModule,

    // Add Winston for logging
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
          ),
        }),
      ],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply logger to all routes
  }
}

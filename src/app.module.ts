import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction
              ? {
                  rejectUnauthorized: false,
                }
              : false,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
        };
      },
      inject: [ConfigService],
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}

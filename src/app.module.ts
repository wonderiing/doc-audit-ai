import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TextExtractionModule } from './text-extraction/text-extraction.module';
import { AiModule } from './ai/ai.module';
import { AuditRecordModule } from './audit-record/audit-record.module';

@Module({

  imports: [

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),

    FilesModule,

    AuthModule,

    CommonModule,

    TextExtractionModule,

    AiModule,

    AuditRecordModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

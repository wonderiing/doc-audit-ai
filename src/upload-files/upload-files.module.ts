import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileType } from './interfaces/file-type.interface';
import { FileDocument } from './entities/file-document.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
  imports: [
    TypeOrmModule.forFeature([FileDocument]),
    ConfigModule
  ]
})
export class UploadFilesModule {}

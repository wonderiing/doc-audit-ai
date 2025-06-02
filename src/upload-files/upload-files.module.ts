import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileType } from './interfaces/file-type.interface';
import { FileDocument } from './entities/file-document.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
  imports: [
    TypeOrmModule.forFeature([FileDocument]),
    ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'})  ,
    JwtModule
  ]
})
export class UploadFilesModule {}

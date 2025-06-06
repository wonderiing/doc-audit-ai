import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AuditRecordService } from './audit-record.service';
import { CreateAuditRecordDto } from './dto/create-audit-record.dto';
import { UpdateAuditRecordDto } from './dto/update-audit-record.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';

@Controller('audit-record')
export class AuditRecordController {
  constructor(private readonly auditRecordService: AuditRecordService) {}

  @Post()
  @Auth(UserRoles.auditor)
  create(@Body() createAuditRecordDto: CreateAuditRecordDto, @GetUser() user: User) {
    return this.auditRecordService.create(createAuditRecordDto, user)
  }
}

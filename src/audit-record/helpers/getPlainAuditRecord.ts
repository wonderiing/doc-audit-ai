import { plainToInstance } from "class-transformer"
import { AuditRecord } from "../entities/audit-record.entity"
import {ResponseAuditRecordDto} from "../dto/response-audit-record.dto"

 export function getPlainAuditRecord(auditRecord: AuditRecord) {
    const response = plainToInstance(ResponseAuditRecordDto, {
        id: auditRecord.id,
        fileId: auditRecord.file.id,
        auditedAt: auditRecord.audited_at,
        notes: auditRecord.notes,
        status: auditRecord.status,
        aiAnalysisId: auditRecord.aiAnalysis.id,
        userId: auditRecord.user.id
      })
    
    return response
  }
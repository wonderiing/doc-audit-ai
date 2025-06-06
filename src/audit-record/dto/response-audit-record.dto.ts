import { AuditRecordStatus } from "../interfaces/auditRecordStatus.interface"

export class ResponseAuditRecordDto {
  id: number
  fileId: number
  auditedAt: Date
  notes: string
  status: AuditRecordStatus
  aiAnalysisId: number
  userId: number 
}

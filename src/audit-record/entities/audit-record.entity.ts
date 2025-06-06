import { AiAnalysis } from "src/ai/entities/ai-analysis.entity";
import { FileDocument } from "src/files/entities/file-document.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuditRecordStatus } from "../interfaces/auditRecordStatus.interface";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class AuditRecord {

    @PrimaryGeneratedColumn('identity')
    id: number

    
    @Column('text')
    notes: string
    
    @Column({
        type: 'enum',
        enum: AuditRecordStatus,
        default: AuditRecordStatus.pending
    })    
    status: AuditRecordStatus
    
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    audited_at: Date
    
    @OneToOne(
        () => FileDocument,
        (fileDocument ) => fileDocument.auditRecord,
        {onDelete: 'CASCADE'}
    )
    @JoinColumn()
    file: FileDocument
    
    @OneToOne(
        () => AiAnalysis,
        (aiAnalysis) => aiAnalysis.auditRecord
    )
    @JoinColumn()
    aiAnalysis: AiAnalysis

    @ManyToOne(
        () => User,
        (user) => user.auditRecord
    )
    user: User
}



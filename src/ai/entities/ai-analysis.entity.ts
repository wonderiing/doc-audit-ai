import { AuditRecord } from "src/audit-record/entities/audit-record.entity";
import { TextExtraction } from "src/text-extraction/entities/text-extraction.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AiAnalysis {

    @PrimaryGeneratedColumn('identity')
    id: number

    @OneToOne(
        () => TextExtraction,
        (textExtraction) => textExtraction.ai_analysis,
        {onDelete: 'CASCADE', eager: true}
    )
    @JoinColumn()
    text_extraction: TextExtraction

    @Column('text')
    ai_response: string
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    analyzed_at: Date

    @OneToOne(
        () => AuditRecord,
        (auditRecord) => auditRecord.aiAnalysis
    )
    auditRecord: AuditRecord

}

import { AiAnalysis } from "src/ai/entities/ai-analysis.entity";
import { FileDocument } from "src/files/entities/file-document.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TextExtraction {

    @PrimaryGeneratedColumn('identity')
    id: number

    @Column('text')
    raw_text: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    extracted_at: Date

    
    @OneToOne(
        () => FileDocument,
        (file) => file.text_extraction,
        {onDelete: 'CASCADE', eager: true}
    )
    @JoinColumn()
    file: FileDocument

    @OneToOne(
        () => AiAnalysis,
        (aiAnalysis) => aiAnalysis.text_extraction,
        {onDelete: 'CASCADE'}
    )
    ai_analysis: AiAnalysis

}

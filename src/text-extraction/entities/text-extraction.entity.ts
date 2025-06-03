import { FileDocument } from "src/upload-files/entities/file-document.entity";
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
    )
    @JoinColumn()
    file: FileDocument

}

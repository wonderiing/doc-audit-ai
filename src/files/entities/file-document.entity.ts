import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FileType } from "../interfaces/file-type.interface";
import { User } from "src/auth/entities/user.entity";
import { TextExtraction } from "src/text-extraction/entities/text-extraction.entity";

@Entity()
export class FileDocument {

    @PrimaryGeneratedColumn('identity')
    id: number

    @Column('text', {unique: true})
    filename: string

    @Column('text', {unique: true})
    url: string

    @Column({
        type: 'enum',
        enum: FileType,
        default: FileType.text
    })
    type: FileType

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    uploaded_at: Date

    @Column('bool', {default: false})
    been_audited: Boolean

    @Column('bool', {default: true})
    is_active: Boolean

    @ManyToOne(
        () => User,
        (user) => user.fileDocument,
        {eager: true}
    )
    user: User

    @OneToOne(
        () => TextExtraction,
        (textExtraction) => textExtraction.file,
        {cascade: true} 
    )
    text_extraction: TextExtraction


}

import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../interfaces/user-role.interface";
import { FileDocument } from "src/files/entities/file-document.entity";
import * as bcrypt from 'bcrypt'
import { AuditRecord } from "src/audit-record/entities/audit-record.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn('identity')
    id: number

    @Column('text')
    fullName: string

    @Column('text', { unique: true})
    email: string

    @Column('text', {select: false, nullable: true})
    password: string | null

    @Column('text', {unique: true, nullable: true})
    googleId: string | null

    @Column({
        type: 'text',
        default: ['user'],
        array: true
    })
    roles: string[]

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column('bool', {default: true})
    isActive: Boolean

    @OneToMany(
        () => FileDocument,
        (fileDocument) => fileDocument.user,
        {onDelete: 'CASCADE' }
    )
    fileDocument: FileDocument


    @OneToMany(
        () => AuditRecord,
        (auditRecord) => auditRecord.user
    )
    auditRecord: AuditRecord
    
    @BeforeInsert()
    hashPassword() {
        if (this.password != null) {
            this.password = bcrypt.hashSync(this.password, 10)
        }
    }

}

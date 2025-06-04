import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../interfaces/user-role.interface";
import { FileDocument } from "src/files/entities/file-document.entity";
import * as bcrypt from 'bcrypt'

@Entity()
export class User {

    @PrimaryGeneratedColumn('identity')
    id: number

    @Column('text')
    fullName: string

    @Column('text', { unique: true})
    email: string

    @Column('text', {select: false})
    password: string

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


    
    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10)
    }

}

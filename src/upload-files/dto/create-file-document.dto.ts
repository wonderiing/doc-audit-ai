import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { FileType } from "../interfaces/file-type.interface";

export class CreateFileDocumentDto {

    @IsString()
    filename: string

    @IsString()
    url: string

    @IsBoolean()
    @IsOptional()
    beenAudited?: Boolean

    @IsEnum(FileType)
    type: FileType

    @IsOptional()
    uploaded_at?: Date

}   



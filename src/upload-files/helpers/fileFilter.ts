import { BadRequestException } from "@nestjs/common"
import { FileType } from "../interfaces/file-type.interface"

export const fileFilter = (
    req: Express.Request, file: Express.Multer.File, callback: Function
) => {

    // TODO: Tirar error unsupported fileext

    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['pdf', 'jpg', 'png', 'docx', 'text', 'csv']

    if (validExtension.includes(fileExtension))
        return callback(null, true)
    
    return callback(
     new BadRequestException(`Unsupported file extension: .${fileExtension}`),
    false
  );
}
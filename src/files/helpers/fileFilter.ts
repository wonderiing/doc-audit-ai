import { BadRequestException } from "@nestjs/common"
import {extname} from 'path'
import { FileType } from "../interfaces/file-type.interface"


export const fileFilter = (
    req: Express.Request, file: Express.Multer.File, callback: Function
) => {


    const fileExtension = extname(file.originalname).toLowerCase()
    console.log(fileExtension)
    const validExtension = ['.pdf', '.jpg', '.png', '.docx', '.txt', '.csv', '.xlsx']

    if (validExtension.includes(fileExtension))
        return callback(null, true)
    
    return callback(
     new BadRequestException(`Unsupported file extension: .${fileExtension}`),
    false
  );
}
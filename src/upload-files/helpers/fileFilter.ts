import { FileType } from "../interfaces/file-type.interface"

export const fileFilter = (
    req: Express.Request, file: Express.Multer.File, callback: Function
) => {

    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['pdf', 'jpg', 'png', 'docx', 'text']

    if (validExtension.includes(fileExtension))
        return callback(null, true)
    
    callback(null, false)
}
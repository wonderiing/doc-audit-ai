import { extname, basename } from 'path'

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false)

  const fileExtension = extname(file.originalname).toLowerCase()
  const nameWithoutExt = basename(file.originalname, fileExtension)

  // Evitar duplicados agregando un sufijo corto (timestamp + random)
  const uniqueSuffix = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 6)}`

  const fileName = `${nameWithoutExt}-${uniqueSuffix}${fileExtension}`

  callback(null, fileName)
}

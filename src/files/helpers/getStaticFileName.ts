import { BadRequestException } from "@nestjs/common"
import { existsSync } from "fs"
import { join } from "path"

 export function getStaticFileName(fileName: string) {

    const path = join(__dirname, '../../../static/files', fileName)

    if (!existsSync(path)) {
      throw new BadRequestException(`No File found with name ${fileName}`)
    }
    return path
   }
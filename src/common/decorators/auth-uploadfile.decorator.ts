import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Auth } from "src/auth/decorators/auth.decorator";
import { UserRoles } from "src/auth/interfaces/user-role.interface";
import { fileFilter } from "src/files/helpers/fileFilter";
import { fileNamer } from "src/files/helpers/fileNamer";


export function AuthUploadFile(...roles: UserRoles[]) {
    return applyDecorators(
        Auth(...roles),
        UseInterceptors( FileInterceptor('file', {
            fileFilter: fileFilter,
            limits: {fileSize: 100000000},
            storage: diskStorage({
              destination: './static/files',
              filename: fileNamer
            })
          }) )
    )
}
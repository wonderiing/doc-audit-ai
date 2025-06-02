import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRoles } from "../interfaces/user-role.interface";
import { RolesProtected } from "./roles-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRolesGuard } from "../guard/user-roles.guard";


export function Auth(...roles: UserRoles[]) {

    return applyDecorators(
        RolesProtected(...roles),
        UseGuards(AuthGuard(), UserRolesGuard)
    )

}
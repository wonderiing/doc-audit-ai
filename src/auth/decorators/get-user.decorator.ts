import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";



export const GetUser = createParamDecorator((
    data: string,
    ctx: ExecutionContext
) => {

    const req = ctx.switchToHttp().getRequest()
    const user = req.user

    if (!user) throw new BadRequestException(`User was not found`)

    if (!data) return user

    return user[data]


}) 
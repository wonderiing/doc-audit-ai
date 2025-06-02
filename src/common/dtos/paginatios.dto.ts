import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, isPositive } from "class-validator"

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?: number
}
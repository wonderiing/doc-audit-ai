import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class AiForecastRequestDto {
    @IsNumber()
    @IsPositive()
    fileId: number;

    @IsOptional()
    level?: string;

    @IsNumber()
    @IsPositive()
    n_days: number;
}
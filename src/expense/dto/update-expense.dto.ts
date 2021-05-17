import { IsDateString, IsOptional, Length, Max, Min } from 'class-validator';

export class UpdateExpenseDto {
    @IsOptional()
    @Length(1, 40)
    name: string;

    @IsOptional()
    @Min(0)
    @Max(Number.MAX_VALUE)
    amount: number;

    @IsOptional()
    @IsDateString()
    date: string;

    @IsOptional()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    paidBy: number;
}

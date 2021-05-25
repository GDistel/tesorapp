import { IsDateString, IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CreateExpenseDto {
    @IsNotEmpty()
    @Length(1, 40)
    name: string;

    @IsNotEmpty()
    @Min(0)
    @Max(Number.MAX_VALUE)
    amount: number;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    paidBy: number;

    @IsNotEmpty()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    participantIds: number[];
}

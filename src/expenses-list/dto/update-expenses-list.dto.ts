import { Length, IsOptional } from 'class-validator';
import { Currencies, ExpensesListStatus } from '../expenses-list.enums';

export class UpdateExpensesListDto {
    @IsOptional()
    @Length(1, 40)
    name: string;

    @IsOptional()
    @Length(1, 256)
    description: string;

    @IsOptional()
    currency: Currencies;

    @IsOptional()
    status: ExpensesListStatus;
}

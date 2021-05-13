import { IsNotEmpty } from 'class-validator';
import { Currencies } from '../expenses-list.enums';

export class CreateExpensesListDto {
    @IsNotEmpty() name: string;
    @IsNotEmpty() description: string;
    @IsNotEmpty() currency: Currencies;
}

import { IsNotEmpty, Length } from 'class-validator';
import { Currencies } from '../expenses-list.enums';

export class CreateExpensesListDto {
    @IsNotEmpty()
    @Length(1, 40)
    name: string;

    @IsNotEmpty()
    @Length(1, 256)
    description: string;

    @IsNotEmpty()
    currency: Currencies;
}

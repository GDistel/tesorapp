import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ExpenseType } from '../expense.enums';

export class GetExpenseFilterDto {
    @IsOptional()
    @IsIn([ExpenseType.USER, ExpenseType.SYSTEM])
    type: ExpenseType;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}

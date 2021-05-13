import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ExpensesListStatus } from '../expenses-list.enums';

export class GetExpensesListFilterDto {
    @IsOptional()
    @IsIn([ExpensesListStatus.OPEN, ExpensesListStatus.ARCHIVED])
    status: ExpensesListStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}

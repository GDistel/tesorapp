import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Expense } from './expense.entity';
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseType } from './expense.enums';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { PagedResponse, Pagination } from 'src/shared';

@EntityRepository(Expense)
export class ExpenseRepository extends Repository<Expense> {

    async getExpenses(
        filterDto: GetExpenseFilterDto,
        user: User,
        pagination: Pagination,
        expensesListId?: number
    ): Promise<PagedResponse<Expense[]>> {
        const { type, search } = filterDto;
        const query = this.createQueryBuilder('expense');
        query.where('expense.userId = :userId', { userId: user.id });
        if (expensesListId) {
            query.andWhere('expense.expensesListId = :expensesListId', { expensesListId });
        }
        if (type) {
            query.andWhere('expense.type = :type', { type });
        }
        if (search) {
            query.andWhere(
                '(expense.name LIKE :search)',
                { search: `%${search}%` },
            );
        }
        const paginatedQuery = pagination.paginateQuery<Expense>(query);
        try {
            const [expenses, totalCounts] = await paginatedQuery.getManyAndCount();
            return pagination.paginateItems<Expense[]>(expenses, totalCounts);    
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException();
        }
    }

    async createExpense(createExpenseDto: CreateExpenseDto, expensesList: ExpensesList, user: User): Promise<Expense> {
        const { name, amount, date, paidBy } = createExpenseDto;
        const expense = new Expense();
        expense.name = name;
        expense.amount = amount;
        expense.date = date;
        expense.paidBy = paidBy;
        // expense.destinataries = destinataries;
        expense.type = ExpenseType.USER;
        expense.expensesList = expensesList;
        expense.user = user;
        try {
            await expense.save();
        } catch(err) {
            console.log(err)
            throw new InternalServerErrorException();
        }
        delete expense.expensesList;
        delete expense.user;
        return expense;
    }
}

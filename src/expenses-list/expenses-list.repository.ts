import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, EntitySchema, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { ExpensesList } from './expenses-list.entity';
import { ExpensesListStatus } from './expenses-list.enums';
import { GetExpensesListFilterDto } from './dto/get-expenses-list-filter.dto';

@EntityRepository(ExpensesList)
export class ExpensesListRepository extends Repository<ExpensesList> {

    async getExpensesLists(filterDto: GetExpensesListFilterDto, user: User): Promise<ExpensesList[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('expensesList');
        query.where('expensesList.userId = :userId', {userId: user.id});
        if (status) {
            query.andWhere('expensesList.status = :status', { status });
        }
        if (search) {
            query.andWhere(
                '(expensesList.name LIKE :search OR expensesList.description LIKE :search)',
                { search: `%${search}%` },
            );
        }
        try {
            const expensesLists = await query.getMany();
            return expensesLists;    
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async createExpensesList(createExpensesListDto: CreateExpensesListDto, user: User): Promise<ExpensesList> {
        const { name, description, currency } = createExpensesListDto;
        const expensesList = new ExpensesList();
        expensesList.name = name;
        expensesList.description = description;
        expensesList.currency = currency;
        expensesList.status = ExpensesListStatus.OPEN;
        expensesList.user = user;
        try {
            await expensesList.save();
        } catch(err) {
            throw new InternalServerErrorException();
        }
        delete expensesList.user;
        return expensesList;
    }
}

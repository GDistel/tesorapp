import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExpensesListRepository } from './expenses-list.repository';
import { GetExpensesListFilterDto } from './dto/get-expenses-list-filter.dto';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { User } from 'src/auth/user.entity';
import { ExpensesList } from './expenses-list.entity';
import { UpdateExpensesListDto } from './dto/update-expenses-list.dto';

@Injectable()
export class ExpensesListService {
    constructor(
        @InjectRepository(ExpensesListRepository)
        private taskRepository: ExpensesListRepository,
    ) {}

    async getExpensesLists(filterDto: GetExpensesListFilterDto, user: User): Promise<ExpensesList[]> {
        return this.taskRepository.getExpensesLists(filterDto, user);
    }

    async getExpensesListById(id: number, user: User): Promise<ExpensesList> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`ExpensesList with ID "${id}" not found`);
        }
        delete found.expenses;
        return found;
    }

    async createExpensesList(createExpensesListDto: CreateExpensesListDto, user: User): Promise<ExpensesList> {
        return this.taskRepository.createExpensesList(createExpensesListDto, user);
    }

    async deleteExpensesList(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`ExpensesList with ID "${id}" not found`);
        }
    }

    async updateExpensesListStatus(
        id: number, updateExpensesListDto: UpdateExpensesListDto, user: User
    ): Promise<ExpensesList> {
        const expensesList = await this.getExpensesListById(id, user);
        if (updateExpensesListDto.name) {
            expensesList.name = updateExpensesListDto.name;
        }
        if (updateExpensesListDto.description) {
            expensesList.description = updateExpensesListDto.description;
        }
        if (updateExpensesListDto.status) {
            expensesList.status = updateExpensesListDto.status;
        }
        if (updateExpensesListDto.currency) {
            expensesList.currency = updateExpensesListDto.currency;
        }
        await expensesList.save();
        return expensesList;
    }
}


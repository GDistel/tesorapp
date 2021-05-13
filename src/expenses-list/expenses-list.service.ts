import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExpensesListRepository } from './expenses-list.repository';
import { GetExpensesListFilterDto } from './dto/get-expenses-list-filter.dto';
import { ExpensesListStatus } from './expenses-list.enums';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { User } from 'src/auth/user.entity';
import { ExpensesList } from './expenses-list.entity';

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

    async updateExpensesListStatus(id: number, status: ExpensesListStatus, user: User): Promise<ExpensesList> {
        const task = await this.getExpensesListById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}


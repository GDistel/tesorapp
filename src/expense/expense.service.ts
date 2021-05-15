import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.entity';
import { ExpenseRepository } from './expense.repository';
import { ExpenseType } from './expense.enums';
import { ExpensesListRepository } from 'src/expenses-list/expenses-list.repository';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(ExpenseRepository)
        private expenseRepository: ExpenseRepository,
        @InjectRepository(ExpensesListRepository)
        private expensesListRepository: ExpensesListRepository,
    ) {}

    async getExpenses(filterDto: GetExpenseFilterDto, user: User): Promise<Expense[]> {
        return this.expenseRepository.getExpenses(filterDto, user);
    }

    async getExpenseById(id: number, user: User): Promise<Expense> {
        const found = await this.expenseRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Expense with ID "${id}" not found`);
        }
        return found;
    }

    async createExpense(createExpenseDto: CreateExpenseDto, user: User): Promise<Expense> {
        const expensesList = await this.expensesListRepository.findOne({
            where: { id: createExpenseDto.expensesListId, userId: user.id }
        });
        return this.expenseRepository.createExpense(createExpenseDto, expensesList, user);
    }

    // async deleteExpense(id: number, user: User): Promise<void> {
    //     const result = await this.expenseRepository.delete({ id, userId: user.id });
    //     if (result.affected === 0) {
    //         throw new NotFoundException(`Expense with ID "${id}" not found`);
    //     }
    // }

    async updateExpenseStatus(id: number, type: ExpenseType, user: User): Promise<Expense> {
        const expense = await this.getExpenseById(id, user);
        expense.type = type;
        await expense.save();
        return expense;
    }
}


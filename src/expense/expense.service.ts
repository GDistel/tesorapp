import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.entity';
import { ExpenseRepository } from './expense.repository';
import { ExpensesListService } from 'src/expenses-list/expenses-list.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(ExpenseRepository)
        private expenseRepository: ExpenseRepository,
        @Inject(forwardRef(() => ExpensesListService))
        private expensesListService: ExpensesListService
    ) {}

    async getExpenses(filterDto: GetExpenseFilterDto, user: User, expensesListId?: number): Promise<Expense[]> {
        return this.expenseRepository.getExpenses(filterDto, user, expensesListId);
    }

    async getExpenseById(id: number, user: User): Promise<Expense> {
        const found = await this.expenseRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Expense with ID "${id}" not found`);
        }
        return found;
    }

    async createExpense(createExpenseDto: CreateExpenseDto, user: User): Promise<Expense> {
        const expensesList = await this.expensesListService.getExpensesListById(createExpenseDto.expensesListId, user);
        return this.expenseRepository.createExpense(createExpenseDto, expensesList, user);
    }

    async deleteExpense(id: number, user: User): Promise<void> {
        const result = await this.expenseRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Expense with ID "${id}" not found`);
        }
    }

    async updateExpenseStatus(id: number, updateExpenseDto: UpdateExpenseDto, user: User): Promise<Expense> {
        const expense = await this.getExpenseById(id, user);
        if (updateExpenseDto.name) {
            expense.name = updateExpenseDto.name;
        }
        if (updateExpenseDto.amount) {
            expense.amount = updateExpenseDto.amount;
        }
        if (updateExpenseDto.date) {
            expense.date = updateExpenseDto.date;
        }
        if (updateExpenseDto.paidBy) {
            expense.paidBy = updateExpenseDto.paidBy;
        }
        await expense.save();
        return expense;
    }
}


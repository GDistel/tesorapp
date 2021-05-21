import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExpensesListRepository } from './expenses-list.repository';
import { GetExpensesListFilterDto } from './dto/get-expenses-list-filter.dto';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { User } from 'src/auth/user.entity';
import { ExpensesList } from './expenses-list.entity';
import { UpdateExpensesListDto } from './dto/update-expenses-list.dto';
import { ParticipantService } from 'src/participant/participant.service';
import { ExpenseService } from 'src/expense/expense.service';
import { GetExpenseFilterDto } from 'src/expense/dto/get-expense-filter.dto';
import { Participant } from 'src/participant/participant.entity';
import { Expense } from 'src/expense/expense.entity';
import { CreateOrUpdateParticipantDto } from 'src/participant/dto/create-update-participant.dto';
import { PagedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/utils';

@Injectable()
export class ExpensesListService {
    constructor(
        @InjectRepository(ExpensesListRepository)
        private expensesListRepository: ExpensesListRepository,
        @Inject(forwardRef(() => ExpenseService))
        private expenseService: ExpenseService,
        private participantService: ParticipantService
    ) {}

    async getExpensesLists(
        filterDto: GetExpensesListFilterDto, user: User, pagination: Pagination
    ): Promise<PagedResponse<ExpensesList[]>> {
        return this.expensesListRepository.getExpensesLists(filterDto, user, pagination);
    }

    async getExpensesListRelatedExpenses(
        id: number, user: User, filterDto: GetExpenseFilterDto, pagination: Pagination
    ): Promise<PagedResponse<Expense[]>> {
        return this.expenseService.getExpenses(filterDto, user, pagination, id);
    }

    async getExpensesListRelatedParticipants(id: number, user: User): Promise<Participant[]> {
        return this.participantService.getParticipants(user, id);
    }

    async createExpensesListParticipant(
        id: number, createParticipantDto: CreateOrUpdateParticipantDto, user: User
    ): Promise<Participant> {
        const expensesList = await this.getExpensesListById(id, user);
        return this.participantService.createParticipant(createParticipantDto, expensesList, user);
    }

    async getExpensesListById(id: number, user: User): Promise<ExpensesList> {
        const found = await this.expensesListRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`ExpensesList with ID "${id}" not found`);
        }
        delete found.expenses;
        return found;
    }

    async createExpensesList(createExpensesListDto: CreateExpensesListDto, user: User): Promise<ExpensesList> {
        return this.expensesListRepository.createExpensesList(createExpensesListDto, user);
    }

    async deleteExpensesList(id: number, user: User): Promise<void> {
        const result = await this.expensesListRepository.delete({ id, userId: user.id });
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


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ExpenseRepository } from 'src/expense/expense.repository';
import { ExpenseService } from 'src/expense/expense.service';
import { ExpensesListController } from './expenses-list.controller';
import { ExpensesListRepository } from './expenses-list.repository';
import { ExpensesListService } from './expenses-list.service';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ExpenseRepository]),
        TypeOrmModule.forFeature([ExpensesListRepository])
    ],
    controllers: [ExpensesListController],
    providers: [ExpensesListService, ExpenseService]
})
export class ExpensesListModule {}

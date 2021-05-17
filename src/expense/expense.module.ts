import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ExpensesListRepository } from 'src/expenses-list/expenses-list.repository';
import { ExpensesListService } from 'src/expenses-list/expenses-list.service';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';
import { ExpenseService } from './expense.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ExpenseRepository]),
    TypeOrmModule.forFeature([ExpensesListRepository])
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpensesListService]
})
export class ExpenseModule {}

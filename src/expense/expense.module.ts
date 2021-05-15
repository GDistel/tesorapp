import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ExpensesListRepository } from 'src/expenses-list/expenses-list.repository';
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
  providers: [ExpenseService]
})
export class ExpenseModule {}

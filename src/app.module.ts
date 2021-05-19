import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ExpensesListModule } from './expenses-list/expenses-list.module';
import { ExpenseModule } from './expense/expense.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ExpensesListModule,
    ExpenseModule,
    ParticipantModule
  ]
})
export class AppModule {}

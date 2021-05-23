import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { ExpenseModule } from './../expense/expense.module';
import { ExpensesListController } from './expenses-list.controller';
import { ExpensesListRepository } from './expenses-list.repository';
import { ExpensesListService } from './expenses-list.service';

const TypeOrmForExpensesListRepository = TypeOrmModule.forFeature([ExpensesListRepository]);

@Module({
    imports: [
        AuthModule,
        TypeOrmForExpensesListRepository,
        ExpenseModule,
        ParticipantModule
    ],
    controllers: [ExpensesListController],
    providers: [ExpensesListService]
})
export class ExpensesListModule {}

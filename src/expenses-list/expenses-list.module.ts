import { ExpenseModule } from './../expense/expense.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ExpenseRepository } from 'src/expense/expense.repository';
import { ExpenseService } from 'src/expense/expense.service';
import { ParticipantModule } from 'src/participant/participant.module';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { ParticipantService } from 'src/participant/participant.service';
import { ExpensesListController } from './expenses-list.controller';
import { ExpensesListRepository } from './expenses-list.repository';
import { ExpensesListService } from './expenses-list.service';

const TypeOrmForExpensesListRepository = TypeOrmModule.forFeature([ExpensesListRepository]);

@Module({
    imports: [
        AuthModule,
        TypeOrmForExpensesListRepository,
        forwardRef(() => ExpenseModule),
        ParticipantModule
    ],
    controllers: [ExpensesListController],
    providers: [
        ExpensesListService
    ],
    exports: [
        TypeOrmForExpensesListRepository,
        ExpensesListService
    ]
})
export class ExpensesListModule {}

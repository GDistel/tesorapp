import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ExpensesListController } from './expenses-list.controller';
import { ExpensesListRepository } from './expenses-list.repository';
import { ExpensesListService } from './expenses-list.service';

@Module({
    imports: [TypeOrmModule.forFeature([ExpensesListRepository]), AuthModule],
    controllers: [ExpensesListController],
    providers: [ExpensesListService],
})
export class ExpensesListModule {}

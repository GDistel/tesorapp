import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';
import { ExpenseService } from './expense.service';

const TypeOrmForExpenseRepository = TypeOrmModule.forFeature([ExpenseRepository]);

@Module({
  imports: [
    AuthModule,
    TypeOrmForExpenseRepository
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [
    TypeOrmForExpenseRepository,
    ExpenseService
  ]
})
export class ExpenseModule {}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Query,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { GetExpensesListFilterDto } from './dto/get-expenses-list-filter.dto';
import { ExpensesList } from './expenses-list.entity';
import { ExpensesListService } from './expenses-list.service';
import { UpdateExpensesListDto } from './dto/update-expenses-list.dto';
import { Expense } from 'src/expense/expense.entity';
import { ExpenseService } from 'src/expense/expense.service';
import { GetExpenseFilterDto } from 'src/expense/dto/get-expense-filter.dto';
import { Participant } from 'src/participant/participant.entity';
import { CreateOrUpdateParticipantDto } from 'src/participant/dto/create-update-participant.dto';


@Controller('expenses-list')
@UseGuards(AuthGuard())
export class ExpensesListController {

    constructor(private expensesListService: ExpensesListService) {}

    @Get()
    getExpensesLists(
        @Query(ValidationPipe) filterDto: GetExpensesListFilterDto,
        @GetUser() user: User
    ): Promise<ExpensesList[]> {
        return this.expensesListService.getExpensesLists(filterDto, user);
    }

    @Get('/:id')
    getExpensesListById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<ExpensesList> {
        return this.expensesListService.getExpensesListById(id, user);
    }

    @Get('/:id/expenses')
    getExpensesListRelatedExpenses(
        @Param('id', ParseIntPipe) id: number,
        @Query(ValidationPipe) filterDto: GetExpenseFilterDto,
        @GetUser() user: User
    ): Promise<Expense[]> {
        return this.expensesListService.getExpensesListRelatedExpenses(id, user, filterDto);
    }

    @Get('/:id/participants')
    getExpensesListRelatedParticipants(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Participant[]> {
        return this.expensesListService.getExpensesListRelatedParticipants(id, user);
    }

    @Post('/:id/participants')
    createExpensesListParticipant(
        @Param('id', ParseIntPipe) id: number,
        @Body() createParticipantDto: CreateOrUpdateParticipantDto,
        @GetUser() user: User
    ): Promise<Participant> {
        return this.expensesListService.createExpensesListParticipant(id, createParticipantDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createExpensesList(
        @Body() createExpensesListDto: CreateExpensesListDto,
        @GetUser() user: User
    ): Promise<ExpensesList> {
        return this.expensesListService.createExpensesList(createExpensesListDto, user);
    }

    @Delete('/:id')
    deleteExpensesList(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.expensesListService.deleteExpensesList(id, user);
    }

    @Patch('/:id')
    updateExpensesListStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateExpensesListDto: UpdateExpensesListDto,
        @GetUser() user: User
    ): Promise<ExpensesList> {
        return this.expensesListService.updateExpensesListStatus(id, updateExpensesListDto, user);
    }
}

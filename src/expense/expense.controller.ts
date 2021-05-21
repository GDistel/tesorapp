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
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { GetPagination } from 'src/shared/decorators';
import { Pagination } from 'src/shared/utils';
import { PagedResponse } from 'src/shared/interfaces';

@Controller('expense')
@UseGuards(AuthGuard())
export class ExpenseController {

    constructor(private expenseService: ExpenseService) {}

    @Get()
    getExpenses(
        @Query(ValidationPipe) filterDto: GetExpenseFilterDto,
        @GetPagination() pagination: Pagination,
        @GetUser() user: User
    ): Promise<PagedResponse<Expense[]>> {
        return this.expenseService.getExpenses(filterDto, user, pagination);
    }

    @Get('/:id')
    getExpenseById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Expense> {
        return this.expenseService.getExpenseById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createExpense(
        @Body() createExpenseDto: CreateExpenseDto,
        @GetUser() user: User
    ): Promise<Expense> {
        return this.expenseService.createExpense(createExpenseDto, user);
    }

    @Delete('/:id')
    deleteExpense(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.expenseService.deleteExpense(id, user);
    }

    @Patch('/:id')
    updateExpense(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateExpenseDto: UpdateExpenseDto,
        @GetUser() user: User
    ): Promise<Expense> {
        return this.expenseService.updateExpenseStatus(id, updateExpenseDto, user);
    }
}


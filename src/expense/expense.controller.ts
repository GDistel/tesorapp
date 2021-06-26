import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Query,
    Patch,
    ValidationPipe,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { PagedResponse, GetPagination, Pagination } from 'src/shared';

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
        return this.expenseService.updateExpense(id, updateExpenseDto, user);
    }
}


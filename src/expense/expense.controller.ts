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
import { GetExpenseFilterDto } from './dto/get-expense-filter.dto';
import { Expense } from './expense.entity';
import { ExpenseType } from './expense.enums';
import { ExpenseService } from './expense.service';

@Controller('expense')
@UseGuards(AuthGuard())
export class ExpenseController {

    constructor(private expenseService: ExpenseService) {}

    @Get()
    getExpenses(
        @Query(ValidationPipe) filterDto: GetExpenseFilterDto,
        @GetUser() user: User
    ): Promise<Expense[]> {
        return this.expenseService.getExpenses(filterDto, user);
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

    // @Delete('/:id')
    // deleteExpense(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    //     return this.expenseService.deleteExpense(id, user);
    // }

    // @Patch('/:id/status')
    // updateExpenseStatus(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body('type', ExpenseValidationPipe) type: ExpenseType,
    //     @GetUser() user: User
    // ): Promise<Expense> {
    //     return this.expenseService.updateExpenseStatus(id, status, user);
    // }
}


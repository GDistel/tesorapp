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

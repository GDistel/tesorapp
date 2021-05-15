import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { Expense } from 'src/expense/expense.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => ExpensesList, expensesList => expensesList.user, { eager: true })
    expensesLists: ExpensesList[];

    @OneToMany(type => Expense, expense => expense.user, { eager: true })
    expenses: Expense[];

    async validatePassword(inputPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, this.password);
    }
}

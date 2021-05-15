import { User } from 'src/auth/user.entity';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenseType } from './expense.enums';

@Entity()
export class Expense extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    amount: number;

    @Column()
    date: string;

    @Column()
    paidBy: number; // user id

    // @Column()
    // destinataries: number[];

    @Column()
    type: ExpenseType;

    @ManyToOne(type => ExpensesList, expensesList => expensesList.expenses, { eager: false })
    expensesList: ExpensesList;

    @Column()
    expensesListId: number;

    @ManyToOne(type => User, user => user.expenses, { eager: false })
    user: User;

    @Column()
    userId: number;
}
import { User } from '../auth/user.entity';
import { Expense } from '../expense/expense.entity';
import { ExpensesList } from '../expenses-list/expenses-list.entity';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Participant extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.participants, { eager: false })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(type => ExpensesList, expensesList => expensesList.participants, { eager: false, onDelete: 'CASCADE' })
    expensesList: ExpensesList;

    @Column()
    expensesListId: number;

    @ManyToMany(() => Expense, expense => expense.participants)
    expenses: Expense[];
}
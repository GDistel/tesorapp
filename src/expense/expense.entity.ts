import { User } from 'src/auth/user.entity';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { Participant } from 'src/participant/participant.entity';
import {
    BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn,
    RelationId
} from 'typeorm';
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
    paidBy: number; // participant id

    @Column()
    type: ExpenseType;

    @ManyToOne(type => ExpensesList, expensesList => expensesList.expenses, { eager: false })
    expensesList: ExpensesList;

    @Column()
    expensesListId: number;

    @ManyToMany(() => Participant, participant => participant.expenses)
    @JoinTable()
    participants: Participant[];

    @RelationId((expense: Expense) => expense.participants)
    participantIds: number[];

    @ManyToOne(type => User, user => user.expenses, { eager: false })
    user: User;

    @Column()
    userId: number;
}
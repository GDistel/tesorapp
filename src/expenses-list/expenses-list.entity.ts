import { User } from 'src/auth/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Currencies, ExpensesListStatus } from './expenses-list.enums';
import { Expense } from 'src/expense/expense.entity';
import { Participant } from 'src/participant/participant.entity';

@Entity()
export class ExpensesList extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: ExpensesListStatus;

    @Column()
    currency: Currencies;

    @ManyToOne(type => User, user => user.expensesLists, { eager: false })
    user: User;

    @Column()
    userId: number;

    @OneToMany(type => Expense, expense => expense.expensesList, { eager: true })
    expenses: Expense;

    @OneToMany(type => Participant, participant => participant.expensesList, { eager: true })
    participants: Participant;

}
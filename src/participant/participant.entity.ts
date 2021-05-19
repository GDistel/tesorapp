import { User } from 'src/auth/user.entity';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToOne(type => ExpensesList, expensesList => expensesList.participants, { eager: false })
    expensesList: ExpensesList;

    @Column()
    expensesListId: number;
}
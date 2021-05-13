import { User } from 'src/auth/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currencies, ExpensesListStatus } from './expenses-list.enums';

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

    @ManyToOne(type => User, user => user.expensesList, { eager: false })
    user: User;

    @Column()
    userId: number;
}
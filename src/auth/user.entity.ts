import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { Expense } from 'src/expense/expense.entity';
import { Participant } from 'src/participant/participant.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    verified: boolean;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    token: string;

    @OneToMany(type => ExpensesList, expensesList => expensesList.user, { eager: true })
    expensesLists: ExpensesList[];

    @OneToMany(type => Expense, expense => expense.user, { eager: true })
    expenses: Expense[];

    @OneToMany(type => Participant, participant => participant.user, { eager: true })
    participants: Participant[];

    async validatePassword(inputPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, this.password);
    }
}

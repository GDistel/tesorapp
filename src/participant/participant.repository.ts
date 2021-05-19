import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Participant } from './participant.entity';
import { CreateOrUpdateParticipantDto } from './dto/create-update-participant.dto';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';

@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {

    async getParticipants(user: User, expensesListId?: number): Promise<Participant[]> {
        const query = this.createQueryBuilder('participant');
        if (expensesListId) {
            query.where('participant.expensesListId = :expensesListId', { expensesListId });
        } else {
            query.where('participant.userId = :userId', { userId: user.id });
        }
        try {
            const participants = await query.getMany();
            return participants;    
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async createParticipant(
        createParticipantDto: CreateOrUpdateParticipantDto, expensesList: ExpensesList, user: User
    ): Promise<Participant> {
        const { name } = createParticipantDto;
        const participant = new Participant();
        participant.name = name;
        participant.user = user;
        participant.expensesList = expensesList;
        try {
            await participant.save();
        } catch(err) {
            throw new InternalServerErrorException();
        }
        delete participant.user;
        delete participant.expensesList;
        return participant;
    }
}
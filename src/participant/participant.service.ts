import { AuthService } from './../auth/auth.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ExpensesList } from 'src/expenses-list/expenses-list.entity';
import { ExpensesListService } from 'src/expenses-list/expenses-list.service';
import { CreateOrUpdateParticipantDto } from './dto/create-update-participant.dto';
import { Participant } from './participant.entity';
import { ParticipantRepository } from './participant.repository';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(ParticipantRepository)
        private participantRepository: ParticipantRepository,
        private authService: AuthService
    ) {}

    async getParticipants(user: User, expensesListId?: number): Promise<Participant[]> {
        return this.participantRepository.getParticipants(user, expensesListId);
    }

    async getParticipantById(id: number, user: User): Promise<Participant> {
        const found = await this.participantRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Participant with ID "${id}" not found`);
        }
        return found;
    }

    async createParticipant(createParticipantDto: CreateOrUpdateParticipantDto, expensesList: ExpensesList, user: User): Promise<Participant> {
        let linkToUser = user;
        if (createParticipantDto.linkToUserId) {
            const otherUser = await this.authService.findUserById(createParticipantDto.linkToUserId);
            if (!otherUser) {
                throw new InternalServerErrorException({ error: 'Could not find the user with the provided id' });
            }
            linkToUser = otherUser;
        }
        return this.participantRepository.createParticipant(createParticipantDto, expensesList, linkToUser);
    }

    async deleteParticipant(id: number, user: User): Promise<void> {
        const result = await this.participantRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Participant with ID "${id}" not found`);
        }
    }

    async updateParticipantStatus(
        id: number, updateParticipantDto: CreateOrUpdateParticipantDto, user: User
    ): Promise<Participant> {
        const participant = await this.getParticipantById(id, user);
        if (updateParticipantDto.name) {
            participant.name = updateParticipantDto.name;
        }
        await participant.save();
        return participant;
    }
}

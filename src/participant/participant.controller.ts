import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateOrUpdateParticipantDto } from './dto/create-update-participant.dto';
import { Participant } from './participant.entity';
import { ParticipantService } from './participant.service';

@Controller('participant')
@UseGuards(AuthGuard())
export class ParticipantController {
    constructor(private participantService: ParticipantService) {}

    @Get('/:id')
    getParticipantById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Participant> {
        return this.participantService.getParticipantById(id, user);
    }

    @Delete('/:id')
    deleteParticipant(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.participantService.deleteParticipant(id, user);
    }

    @Patch('/:id')
    updateParticipant(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateParticipantDto: CreateOrUpdateParticipantDto,
        @GetUser() user: User
    ): Promise<Participant> {
        return this.participantService.updateParticipantStatus(id, updateParticipantDto, user);
    }
}

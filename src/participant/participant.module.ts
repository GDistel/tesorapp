import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ParticipantController } from './participant.controller';
import { ParticipantRepository } from './participant.repository';
import { ParticipantService } from './participant.service';

const TypeOrmForParticipantRepository = TypeOrmModule.forFeature([ParticipantRepository]);

@Module({
  imports: [
    AuthModule,
    TypeOrmForParticipantRepository
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [
    TypeOrmForParticipantRepository,
    ParticipantService
  ]
})
export class ParticipantModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as config from 'config';
import { EmailService } from '../shared/email.service';

const JwtConfig = config.get('jwt');
const TypeOrmForUserRepository = TypeOrmModule.forFeature([UserRepository]);

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || JwtConfig.secret,
            signOptions: {
                expiresIn: JwtConfig.accessExpiresIn
            },
        }),
        TypeOrmForUserRepository,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, EmailService],
    exports: [
        JwtStrategy,
        PassportModule,
        TypeOrmForUserRepository,
        AuthService
    ]
})
export class AuthModule {}

import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signup(authCredentialsDto);
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(
            authCredentialsDto,
        );
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generate JWT token with payload ${JSON.stringify(payload)}`)
        return { accessToken };
    }

    async findUserById(id: number): Promise<User> {
        try {
            return this.userRepository.findOne(id);
        } catch (err) {
            throw new InternalServerErrorException(err, 'Could not find the user with the provided it');
        }
    }
}

import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { TokenDto } from './dto/refresh-token.dto';
import * as config from 'config';
import { TokensResponse } from './interfaces';

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
    ): Promise<TokensResponse> {
        const username = await this.userRepository.validateUserPassword(
            authCredentialsDto,
        );
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.getTokens(username);
    }

    async refresh(tokenDto: TokenDto): Promise<TokensResponse> {
        const { username, exp } = this.jwtService.decode(tokenDto.token) as { username: string, exp: number };
        const user: User = await this.userRepository.findOne({ where: { username } });
        const tokenExpired = (new Date()).getTime() > exp * 1000;
        if (!user || tokenExpired) {
            throw new UnauthorizedException('Invalid token');
        }
        return this.getTokens(username);
    }

    async findUserById(id: number): Promise<User> {
        try {
            return this.userRepository.findOne(id);
        } catch (err) {
            throw new InternalServerErrorException(err, 'Could not find the user with the provided id');
        }
    }

    private async getTokens(username: string): Promise<TokensResponse> {
        const payload: JwtPayload = { username };
        const access = this.jwtService.sign(payload);
        const refresh = this.jwtService.sign(payload, { expiresIn: config.get('jwt.refreshExpiresIn') });
        this.logger.debug(`Generated JWT tokens with payload ${JSON.stringify(payload)}`)
        return { access, refresh };
    }
}

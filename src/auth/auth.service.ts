import { UserRepository } from './user.repository';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { TokenDto } from './dto/refresh-token.dto';
import * as config from 'config';
import { TokensResponse, JwtPayload } from './interfaces';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<void> {
        const tokens: TokensResponse = await this.getTokens(signUpDto.username);
        return this.userRepository.signup(signUpDto, tokens.refresh);
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<TokensResponse> {
        const user = await this.userRepository.validateUserPassword(
            authCredentialsDto,
        );
        if (!user?.username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.verified) {
            throw new UnauthorizedException('This user has not been verified')
        };
        const tokens: TokensResponse = await this.getTokens(user.username);
        user.token = tokens.refresh;
        await user.save();
        return tokens;
    }

    async refresh(tokenDto: TokenDto): Promise<TokensResponse> {
        const { username, exp } = this.jwtService.decode(tokenDto.token) as { username: string, exp: number };
        const user: User = await this.userRepository.findOne({ where: { username } });
        const isStoredToken = user.token === tokenDto.token;
        const tokenExpired = (new Date()).getTime() > exp * 1000;
        if (!user || tokenExpired || !isStoredToken) {
            throw new UnauthorizedException('Invalid token');
        }
        const tokens: TokensResponse = await this.getTokens(username);
        user.token = tokens.refresh;
        if (!user.verified) {
            user.verified = true;
        }
        await user.save();
        return tokens;
    }

    async findUserById(id: number): Promise<User> {
        try {
            return this.userRepository.findOne(id);
        } catch (err) {
            throw new InternalServerErrorException(err, 'Could not find the user with the provided id');
        }
    }

    private async getTokens(username: string, customExpiration?: number): Promise<TokensResponse> {
        const payload: JwtPayload = { username };
        const access = this.jwtService.sign(payload);
        const refresh = this.jwtService.sign(payload, {
            expiresIn: customExpiration ?? config.get('jwt.refreshExpiresIn')
        });
        this.logger.debug(`Generated JWT tokens with payload ${JSON.stringify(payload)}`)
        return { access, refresh };
    }

}

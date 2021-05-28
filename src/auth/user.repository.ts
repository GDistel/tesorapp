import {
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signup(signUpDto: SignUpDto, token: string): Promise<void> {
        const { username, password, email } = signUpDto;
        const user = this.create();
        const salt = await bcrypt.genSalt();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.email = email;
        user.verified = false;
        user.token = token;
        // @TODO replace with email verification logic
        console.log(token);
        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username or Email already exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<User> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if (await user?.validatePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}

import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class SignUpDto extends AuthCredentialsDto {
    @MinLength(4)
    @MaxLength(30)
    @IsEmail()
    email: string;
}

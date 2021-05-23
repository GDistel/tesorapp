import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenDto } from './dto/refresh-token.dto';
import { TokensResponse } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    ): Promise<TokensResponse> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Get('/refresh')
    refresh(
        @Query(ValidationPipe) tokenDto: TokenDto
    ): Promise<TokensResponse> {
        return this.authService.refresh(tokenDto);
    }
}

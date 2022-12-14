import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserInputModel } from '../api/models/registerUser.model';
import { RegisterUserViewModel } from './dto/registerUser-view-model.dto';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { LoginUserInputModel } from '../api/models/loginUser.model';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Tokens } from './dto/tokens-view-model.dto';
import { SessionsService } from '../../sessions/application/sessions.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService,
                private readonly usersRepository: UsersRepository,
                private readonly sessionsService: SessionsService,
                private readonly configService: ConfigService) {}

    async register(userData: RegisterUserInputModel): Promise<Tokens> {

        const userByEmail = await this.usersService.getUserByEmail(userData.email)
        const userByUsername = await this.usersService.getUserByUsername(userData.username)

        if(userByEmail) {
            throw new UnauthorizedException('Такой email уже зарегистрирован')
        }

        if(userByUsername) {
            throw new UnauthorizedException('Такой username уже занят')
        }

        const hashPassword = await hash(userData.password, 5)
        const user = await this.usersService.createUser({...userData, password: hashPassword})

        const tokens = await this.generateToken(user)

        this.updateRefreshToken(user, tokens)

        return tokens;
    }

    async login(userData: LoginUserInputModel): Promise<Tokens> {
        const userByEmail = await this.usersService.getUserByEmail(userData.email)

        if (!userByEmail) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }

        const isPasswordEquil = await compare(userData.password, userByEmail.password)

        if (!isPasswordEquil) {
            throw new UnauthorizedException('Неверный пароль')
        }
        const user = await this.usersRepository.getUserWithRolesById(userByEmail.id);

        const tokens = await this.generateToken(user)

        await this.updateRefreshToken(user, tokens)

        if (user.refresh_token) {
            await this.sessionsService.saveUsedToken(user.refresh_token)
        }

        return tokens
    }

    async logout(token: string): Promise<void> {
        await this.checkToken(token)
        const userFromRequest = await this.decodeToken(token)
        const user = await this.usersRepository.getUserWithRolesById(userFromRequest.id);
        if (!user) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }

        const userWithoutRefreshToken = { ...user, refresh_token: null}
        await this.usersService.updateRefreshUser(userWithoutRefreshToken)
        await this.sessionsService.saveUsedToken(token)
    }
    
    async refresh(token: string): Promise<Tokens> {
        await this.checkToken(token)
        const userFromRequest = await this.decodeToken(token)
        const user = await this.usersRepository.getUserWithRolesById(userFromRequest.id);
        

        if (!user) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }


        const isRefreshTokensEquel = await compare(token, user.refresh_token)
        if(!isRefreshTokensEquel) {
            throw new UnauthorizedException('Токены не совпадают')
        }

        const tokens = await this.generateToken(user);
        // const tokens2 = await this.generateToken(user);
        // const tokens3 = await this.generateToken(user);
        // const tokens4 = await this.generateToken(user);

        await this.updateRefreshToken(user, tokens)
        await this.sessionsService.saveUsedToken(token)

        return tokens
    }

    async decodeToken(token: string) {
        try {
            const user = await this.jwtService.verify(token, {
                secret: process.env.PRIVATE_REFRESH_KEY
            })
            return user;
        } catch (err) {
            console.log(err)
            throw new UnauthorizedException()
        }
    }

    async updateRefreshToken(user, tokens: Tokens) {
        const hashToken = await hash(tokens.refresh_token, 10)
        await this.usersService.createUser({...user, refresh_token: hashToken})
    }

    async generateToken(user: RegisterUserViewModel) {
        
        const payload = { id: user.id, username: user.username, email: user.email, roles: user.userRoles}
            // const access_token = await this.jwtService.sign({payload}, {
            //     secret:  this.configService.get<string>('PRIVATE_ACCESS_KEY'),
            //     expiresIn: '15m'
            // })
            // const refresh_token = await this.jwtService.sign({payload}, {
            //     secret:  this.configService.get<string>('PRIVATE_REFRESH_KEY'),
            //     expiresIn: '168h'
            // })
            const [access_token, refresh_token] = await Promise.all([
                this.jwtService.signAsync(payload, {
                  secret: this.configService.get<string>('PRIVATE_ACCESS_KEY'),
                  expiresIn: '15m',
                }),
          
                this.jwtService.signAsync(payload, {
                  secret: this.configService.get<string>('PRIVATE_REFRESH_KEY'),
                  expiresIn: '168h',
                }),
              ]);
            //   console.log( {
            //     access_token, refresh_token
            //   })

        return {
            access_token,
            refresh_token
        }
    }

    async checkToken(token: string): Promise<void> {
        const hasToken = await this.sessionsService.findUsedToken(token)
        if (hasToken) {
            throw new UnauthorizedException()
        }
    }

}

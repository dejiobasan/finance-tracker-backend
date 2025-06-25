import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmailOrUsername(
      dto.email,
      dto.username,
    );
    if (existingUser)
      throw new ConflictException('Email or username already in use');

    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(process.env.saltRounds),
    );
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailOrUsername(dto.username);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token = this.generateToken(user._id, user.email);

    return { access_token, user };
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

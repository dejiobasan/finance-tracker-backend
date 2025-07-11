import {
  Body,
  Get,
  Controller,
  Post,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/decorators/current-user.decorator';
import cloudinary from 'src/config/cloudinary';

interface CloudinaryResponse {
  secure_url: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    let cloudinaryResponse: CloudinaryResponse;
    if (dto.image) {
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(dto.image, {
          folder: 'Users',
        });
        dto.image = cloudinaryResponse?.secure_url;
      } catch {
        throw new InternalServerErrorException('Error uploading image');
      }
    }
    const user = await this.authService.register(dto);
    return res.send({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        number: user.number,
      },
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { access_token, user } = await this.authService.login(dto);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.send({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        number: user.number,
      },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.userId);
  }
}

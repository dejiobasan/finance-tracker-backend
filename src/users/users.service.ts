import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async findByEmailOrUsername(
    email: string,
    username?: string,
  ): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email }, ...(username ? [{ username }] : [])],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password');
  }
}

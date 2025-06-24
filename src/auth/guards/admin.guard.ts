import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';

interface CustomRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Admin access only');
    }
    const currentUser = await this.usersService.findById(user.userId);
    if (currentUser?.role !== 'admin') {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}

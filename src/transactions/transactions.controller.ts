import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CurrentUser,
  JwtPayload,
} from '../common/decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTransactionDto,
  ) {
    const transaction = await this.transactionsService.create(user.userId, dto);
    return {
      message: 'Transaction created successfully',
      data: transaction,
    };
  }

  @Get()
  async getAll(@CurrentUser() user: JwtPayload) {
    const transactions = await this.transactionsService.findAllByUser(
      user.userId,
    );
    return {
      message: 'All transactions retrieved',
      data: transactions,
    };
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const updated = await this.transactionsService.update(user.userId, id, dto);
    return {
      message: 'Transaction updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.transactionsService.delete(user.userId, id);
  }
}

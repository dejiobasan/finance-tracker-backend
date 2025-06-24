import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model, Types } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = new this.transactionModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    await transaction.save();
    return transaction;
  }

  async findAllByUser(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId }).sort({ date: -1 });
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel.findOneAndUpdate(
      { _id: id, userId },
      dto,
      { new: true },
    );
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async delete(userId: string, id: string): Promise<{ message: string }> {
    const result = await this.transactionModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Transaction not found');
    }
    return { message: 'Transaction deleted successfully' };
  }
}

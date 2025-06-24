import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/schemas/transaction.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getAdminStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalCreditTransactions = await this.transactionModel.countDocuments({
      type: 'credit',
    });
    const totalDebitTransactions = await this.transactionModel.countDocuments({
      type: 'debit',
    });
    const averageTransaction = await this.transactionModel.aggregate([
      {
        $group: {
          _id: null,
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);
    return {
      totalUsers,
      totalCreditTransactions,
      totalDebitTransactions,
      averageTransaction,
    };
  }

  async getUserStats(userId: string) {
    const totalUserTransactions = await this.transactionModel.countDocuments({
      userId: userId,
    });

    const totalUserCreditTransactions =
      await this.transactionModel.countDocuments({
        userId: userId,
        type: 'credit',
      });

    const totalUserDebitTransactions =
      await this.transactionModel.countDocuments({
        userId: userId,
        type: 'debit',
      });

    const averageUserTransaction = await this.transactionModel.aggregate([
      { $match: { User: userId } },
      {
        $group: {
          _id: null,
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    return {
      totalUserDebitTransactions,
      totalUserCreditTransactions,
      totalUserTransactions,
      averageUserTransaction,
    };
  }
}

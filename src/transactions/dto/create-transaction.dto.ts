import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(['credit', 'debit'])
  type: 'credit' | 'debit';

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  date?: Date;
}

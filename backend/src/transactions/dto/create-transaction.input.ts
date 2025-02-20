import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsUUID, IsDate, IsOptional, IsNumber, Min } from 'class-validator';
import { TransactionType } from '../models/transaction.model';

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field()
  @IsUUID()
  productId: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  rentalStartDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  rentalEndDate?: Date;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  count: number;
}
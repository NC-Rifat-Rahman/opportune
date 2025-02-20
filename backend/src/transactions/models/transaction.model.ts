import { ObjectType, Field, ID, Float, registerEnumType, Int } from '@nestjs/graphql';
import { User } from '../../auth/models/user.model';
import { Product } from '../../products/models/product.model';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  RENT = 'RENT',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => Product)
  product: Product;

  @Field(() => User)
  seller: User;

  @Field(() => User)
  buyer: User;

  @Field(() => Date, { nullable: true })
  rentalStartDate?: Date;

  @Field(() => Date, { nullable: true })
  rentalEndDate?: Date;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Int)
  count: number;
  
  @Field()
  createdAt: Date;
}
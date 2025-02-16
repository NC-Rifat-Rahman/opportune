import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/auth/models/user.model';
import { Category } from './category.enum';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, ({ nullable: true }))
  rentPrice: number;

  @Field()
  userId: string;

  @Field({ nullable: true })
  available?: boolean;

  @Field(() => User,{ nullable: true })
  user: User;

  @Field(() => [Category])
  categories: Category[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
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

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [Category])
  categories: Category[];
  
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
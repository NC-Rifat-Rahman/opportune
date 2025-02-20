import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, Min, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Category } from '../models/category.enum';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rentPrice?: number;

  @Field(() => [Category])
  @IsArray()
  @IsEnum(Category, { each: true })
  categories: Category[];

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  count: number
}
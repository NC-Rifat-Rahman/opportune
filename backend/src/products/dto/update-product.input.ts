import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Category } from '../models/category.enum';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rentPrice?: number;

  @Field(() => [Category])
  @IsArray()
  @IsEnum(Category, { each: true })
  categories: Category[];
}

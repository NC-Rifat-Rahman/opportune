import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

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
}

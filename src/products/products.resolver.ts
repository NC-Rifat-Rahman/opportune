import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './models/product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver(() => Product)
@UseGuards(AuthGuard)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateProductInput,
  ) {
    console.log("user",user);
    
    return this.productsService.createProduct(user.id, input);
  }

  @Mutation(() => Product)
  updateProduct(
    @CurrentUser() user: { id: string },
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ) {
    return this.productsService.updateProduct(user.id, id, input);
  }

  @Mutation(() => Product)
  deleteProduct(
    @CurrentUser() user: { id: string },
    @Args('id') id: string,
  ) {
    return this.productsService.deleteProduct(user.id, id);
  }

  @Query(() => [Product])
  myProducts(@CurrentUser() user: { id: string }) {
    return this.productsService.getUserProducts(user.id);
  }
}

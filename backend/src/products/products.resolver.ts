import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './models/product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteProductInput } from './dto/delete-product.input';

@Resolver(() => Product)
@UseGuards(AuthGuard)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) { }

  @Mutation(() => Product)
  async createProduct(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateProductInput,
  ) {
    console.log("user", user);

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
    @Args('input') input: DeleteProductInput,
  ) {
    return this.productsService.deleteProduct(user.id, input.id);
  }

  @Query(() => Product)
  async getProductById(@Args('id') id: string) {
    return this.productsService.getProductById(id);
  }


  @Query(() => [Product])
  myProducts(@CurrentUser() user: { id: string }) {
    console.log("product-resolver", user);

    return this.productsService.getUserProducts(user.id);
  }
}

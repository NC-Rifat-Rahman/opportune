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
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) { }

  @Mutation(() => Product)
  @UseGuards(AuthGuard)
  async createProduct(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateProductInput,
  ) {
    console.log("user", user);

    return this.productsService.createProduct(user.id, input);
  }

  @Mutation(() => Product)
  @UseGuards(AuthGuard)
  updateProduct(
    @CurrentUser() user: { id: string },
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ) {
    return this.productsService.updateProduct(user.id, id, input);
  }

  @Mutation(() => Product)
  @UseGuards(AuthGuard)
  deleteProduct(
    @CurrentUser() user: { id: string },
    @Args('input') input: DeleteProductInput,
  ) {
    return this.productsService.deleteProduct(user.id, input.id);
  }

  @Query(() => Product)
  @UseGuards(AuthGuard)
  async getProductById(@CurrentUser() user: { id: string }, @Args('id') id: string) {
    return this.productsService.getProductById(user.id, id);
  }

  @Query(() => Product)
  async getPublicProductById(@Args('id') id: string) {
    return this.productsService.getPublicProductById(id);
  }

  @Query(() => [Product])
  @UseGuards(AuthGuard)
  myProducts(@CurrentUser() user: { id: string }) {
    console.log("product-resolver", user);

    return this.productsService.getUserProducts(user.id);
  }

  @Query(() => [Product])
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }
}

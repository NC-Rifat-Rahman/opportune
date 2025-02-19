import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async createProduct(userId: string, input: CreateProductInput) {
    const { name, description, price, rentPrice, categories } = input

    const modifiedName = name.toLowerCase().replace(/\s+/g, '-');

    return this.prisma.product.create({
      data: {
        name: modifiedName,
        description,
        price,
        rentPrice,
        categories,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async updateProduct(userId: string, productId: string, input: UpdateProductInput) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this product');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: input,
      include: {
        user: true,
      },
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this product');
    }

    return this.prisma.product.delete({
      where: { id: productId },
      include: {
        user: true,
      },
    });
  }

  async getUserProducts(userId: string) {
    return this.prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        rentPrice: true,
        categories: true,
        userId: true,
      },
    });
  }  

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: true,
      },
    });
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    return product;
  }
  
  async getAllProducts() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        rentPrice: true,
        categories: true,
        userId: true,
      },
    });
  }  
}
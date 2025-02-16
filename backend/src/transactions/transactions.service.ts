// src/transactions/transactions.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './models/transaction.model';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(userId: string, input: CreateTransactionInput) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
      include: { user: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.available) {
      throw new ConflictException('Product is not available');
    }

    if (product.userId === userId) {
      throw new ConflictException('Cannot buy/rent your own product');
    }

    // Check if rental is possible for this product
    if (input.type === TransactionType.RENT && !product.rentPrice) {
      throw new BadRequestException('This product is not available for rent');
    }

    const totalAmount = input.type === TransactionType.PURCHASE
      ? product.price
      : (product.rentPrice || 0) * this.calculateRentalDays(input.rentalStartDate, input.rentalEndDate);

    const transaction = await this.prisma.transaction.create({
      data: {
        type: input.type,
        productId: input.productId,
        sellerId: product.userId,
        buyerId: userId,
        rentalStartDate: input.rentalStartDate,
        rentalEndDate: input.rentalEndDate,
        totalAmount,
      },
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });

    // Update product availability
    await this.prisma.product.update({
      where: { id: input.productId },
      data: { available: false },
    });

    return transaction;
  }

  private calculateRentalDays(startDate?: Date, endDate?: Date): number {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });
  }
}
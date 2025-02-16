import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './models/transaction.model';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Transaction)
@UseGuards(AuthGuard)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => Transaction)
  createTransaction(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateTransactionInput,
  ) {
    return this.transactionsService.createTransaction(user.id, input);
  }

  @Query(() => [Transaction])
  myTransactions(@CurrentUser() user: { id: string }) {
    return this.transactionsService.getUserTransactions(user.id);
  }
}
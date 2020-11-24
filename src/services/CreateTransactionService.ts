import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';
import { getCustomRepository } from 'typeorm'

import Transaction from '../models/Transaction';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}


class CreateTransactionService {

  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    const transactionsRepo = getCustomRepository(TransactionsRepository); 
    const { total } = await transactionsRepo.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    const categoryDB = await new CreateCategoryService().execute({category});

    const transaction = transactionsRepo.create({title, value, type, category: categoryDB});
    await transactionsRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}


class CreateTransactionService {

  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    const { total } = await new TransactionsRepository().getBalance();

    if (type === 'outcome' && total < value) {
      new AppError('You do not have enough balance');
    }
    const {id} = await new CreateCategoryService().execute({category});

    const transaction = new TransactionsRepository().create({title, value, type, category_id: id});

    return transaction;
  }
}

export default CreateTransactionService;

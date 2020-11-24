import AppError from '../errors/AppError';
import { Repository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction';

interface Request {
  id: string
}
class DeleteTransactionService {
  transactionRep =  new Repository<Transaction>();

  public async execute({id}: Request): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepo.findOne(id);

    if(!transaction){
      throw new AppError("Transaction does't exists");
    }

    await transactionRepo.remove(transaction);
    
  }
}

export default DeleteTransactionService;

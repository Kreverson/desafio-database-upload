import AppError from '../errors/AppError';
import { Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Request {
  id: string
}
class DeleteTransactionService {
  transactionRep =  new Repository<Transaction>();

  public async execute({id}: Request): Promise<void> {

    const transaction = await this.transactionRep.findOne({ where: { id }});

    if(!transaction){
      new AppError("Transaction does't exists");
    }

    await this.transactionRep.delete(id);
    
  }
}

export default DeleteTransactionService;

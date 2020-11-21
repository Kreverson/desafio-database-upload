import Transaction from '../models/Transaction';
import { Repository } from 'typeorm';

class ImportTransactionsService {
  transactionRep = new Repository<Transaction>();

  async execute(): Promise<Transaction[]> {
    return await this.transactionRep.find();
  }
}

export default ImportTransactionsService;

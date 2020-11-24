import { json, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import multer, { Options } from 'multer';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRep = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRep.find();
  const balance = await transactionRep.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const {title, value, type, category} = request.body;
  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({title, value, type, category});
  return  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const {id} = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({id});
  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {

  const importTransactionsService = new ImportTransactionsService();

  const transactions = await importTransactionsService.execute(request.file.path)
  
  return response.json(transactions);
});

export default transactionsRouter;

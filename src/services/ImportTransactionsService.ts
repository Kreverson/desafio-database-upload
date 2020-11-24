import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import { getRepository, getCustomRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import Category from '../models/Category';


interface CSVTransaction {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);
    const categoriesRepo =  getCustomRepository(CategoriesRepository);
    const transactionsRepo =  getCustomRepository(TransactionsRepository);

    const parsers = csvParse({
      from_line: 2
    });
    
    const parseCSV = contactsReadStream.pipe(parsers);

    const categories: string[] = [];
    const transactions: CSVTransaction[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category ] = line.map((cell: string)=> {
        cell.trim()
      });

      if(!title || !type || !value) return;

      categories.push(category);
      transactions.push({title, type, value, category});

    });

    await new Promise(resolve => parseCSV.on('end', resolve));
    const existentCategories = await categoriesRepo.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title
    );

    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category))
    .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepo.create(
      addCategoryTitles.map(title => ({title}))
    )

    await categoriesRepo.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepo.create(
      transactions.map(transaction => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(
            category => category.title === transaction.category
          )
        })
      )
    );

    await transactionsRepo.save(createdTransactions);
    await fs.promises.unlink(filePath);
    return createdTransactions;
  }
}

export default ImportTransactionsService;

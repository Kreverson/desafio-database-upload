import Category from '../models/Category';
import { getCustomRepository } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request{
    category: string
}

class CreateCategoryService {

    public async execute({category} : Request): Promise<Category>{
        const title = category.trim();
        const categoryRepo = getCustomRepository(CategoriesRepository);

        let categoryDB = await categoryRepo.findOne({where: { title }})

        if(!categoryDB) {
            categoryDB = categoryRepo.create({ title });
            await categoryRepo.save(categoryDB);
        }
        
        return categoryDB;
    }
}

export default CreateCategoryService;
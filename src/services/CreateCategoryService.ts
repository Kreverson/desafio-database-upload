import Category from '../models/Category';
import { Repository } from 'typeorm';

interface Request{
    category: string
}

class CreateCategoryService {
    categoryRepository = new Repository<Category>();

    public async execute({category} : Request): Promise<Category>{
        const title = category.trim();

        let categoryDB = await this.categoryRepository.findOne({where: { title }})

        if(!categoryDB) {
            categoryDB = this.categoryRepository.create({ title });
        }
        
        return categoryDB;
    }

}

export default CreateCategoryService;
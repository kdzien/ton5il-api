import { CategoryModel } from '../models/Category';
import { Request, Response } from 'express';

export const allCategories = async (req: Request, res: Response) => {
  try{
    const categories = await CategoryModel.getAllCategories();
    res.send(categories)
  }catch(err){
    res.send(err);
  }
}

import { getProducts } from './productController';
import { CategoryModel } from '../models/Category';
import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export const getCategories = async (req: Request, res: Response) => {
  try{
    const categories = await CategoryModel.getCategories();
    const final_categories = [];
    for (let category of categories){
      const products = await ProductModel.getProducts(category._id);
      let temp_product = Object.assign({},category._doc);
      temp_product.count = products.length;
      final_categories.push(temp_product)
    }
    res.send(final_categories)
  }catch(err){
    res.send(err);
  }
}

export const getCategory = async (req: Request, res: Response) => {
  const category_id = req.params.category_id
  try{
    const product = await CategoryModel.getCategory(category_id);
    res.send(product)
  }catch(err){
    res.send(err);
  }
}

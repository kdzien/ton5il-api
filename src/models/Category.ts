import { prop, Typegoose, ModelType, InstanceType, staticMethod } from 'typegoose';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

class Category extends Typegoose {
  @prop({required: true})
  name: string;

  @staticMethod
  static getCategories(this: ModelType<Category> & typeof Category) {
    return this.find();
  }
  @staticMethod
  static getCategory(this: ModelType<Category> & typeof Category, category_id: string) {
    return this.findOne({_id:category_id});
  }
}
const CategoryModel = new Category().getModelForClass(Category);

export { Category, CategoryModel }
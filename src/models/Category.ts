import { prop, Typegoose, ModelType, InstanceType, staticMethod } from 'typegoose';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

class Category extends Typegoose {
  @prop({required: true})
  name: string;

  @staticMethod
  static getAllCategories(this: ModelType<Category> & typeof Category) {
    return this.find();
  }
}
const CategoryModel = new Category().getModelForClass(Category);

export { CategoryModel }
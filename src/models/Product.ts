import { prop, Typegoose, ModelType, InstanceType, staticMethod, Ref } from 'typegoose';
import { Request, Response } from 'express';
import { Category } from './Category'
import * as mongoose from 'mongoose';

class Product extends Typegoose {
  @prop({required: true})
  name: string;
  @prop({required: true})
  price: number;
  @prop()
  producer: string; 
  @prop({required: true})
  quantity: number; 
  @prop({default: ''})
  description: string;
  @prop({default: 0})
  sold: number;
  @prop({required: true})
  condition: string;
  @prop({required: true})
  date_add: Date;
  @prop({required: true, default:'http://www.skleptonsil.pl/img/products/10/84/13.jpg'})
  img_src: string;
  @prop({ ref: Category, required: true })
  category: Ref<Category>;

  @staticMethod
  static getProducts(this: ModelType<Product> & typeof Product, category_id: string) {
    return this.find({category: category_id});
  }
  @staticMethod
  static getProduct(this: ModelType<Product> & typeof Product, product_id: string) {
    return this.findOne({_id:product_id});
  }
  @staticMethod
  static findProducts(this: ModelType<Product> & typeof Product, find_phrase: string) {
    return this.find({$or: [{'name': {'$regex': new RegExp('^' + find_phrase, 'i')}}, {'description': {'$regex': new RegExp('^' + find_phrase, 'i')}}]});
  }
  @staticMethod
  static getBestsellers(this: ModelType<Product> & typeof Product) {
    return this.find().sort('-sold').limit(3).select({"description": 0});;
  }
  @staticMethod
  static getNews(this: ModelType<Product> & typeof Product) {
    return this.find().sort('-date_add').limit(3).select({"description": 0});
  }
}
const ProductModel = new Product().getModelForClass(Product);

export { ProductModel }


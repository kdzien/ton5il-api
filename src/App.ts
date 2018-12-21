import { addProduct, getProducts, getProduct, getDataFromProducer, findInShop, getPromo } from './controllers/productController';
import { getCategories, getCategory } from './controllers/categoryController';
import { registerUser, loginUser } from './controllers/userController';
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as path from 'path';
import * as cors from 'cors';
class App {
  public app: express.Application;
  private db_uri: string = 'mongodb://127.0.0.1:27017/local';
  constructor() {
    this.app = express();
    this.config();
  }
  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.post('/register', registerUser);
    this.app.post('/login', loginUser);
    this.app.get(`/categories`,getCategories);
    this.app.get('/products/:category_id', getProducts);
    this.app.get('/category/:category_id', getCategory);
    this.app.get('/products/find/:find_phrase', findInShop);
    this.app.get('/product/:product_id', getProduct);
    this.app.post('/product', addProduct);
    this.app.get('/getDataFromProducer', getDataFromProducer)
    this.app.get('/shop/promotions', getPromo);
    
    mongoose.connect(this.db_uri, (err: any) => {
      err ? console.log(err) : console.log("Połączono z bazą")
    })
  }
}

export default new App().app;
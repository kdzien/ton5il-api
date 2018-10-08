import { allCategories } from './controllers/categoryController';
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
class App {
  public app: express.Application;
  private db_uri: string = 'mongodb://127.0.0.1:27017/local';
  constructor() {
    this.app = express();
    this.config();
  }
  private config(): void {
    this.app.use(bodyParser.json());
    
    this.app.get(`/categories`,allCategories);
    
    mongoose.connect(this.db_uri, (err: any) => {
      err ? console.log(err) : console.log("Połączono z bazą")
    })
  }
}

export default new App().app;
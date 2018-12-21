import { prop, Typegoose, ModelType, InstanceType, staticMethod, instanceMethod } from 'typegoose';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';


class User extends Typegoose {
  @prop({required: true})
  name: string;
  @prop({required: true, unique: true})
  email: string;
  @prop()
  hash: string;
  @prop()
  salt: string;

  @instanceMethod
  setPassword(this: InstanceType<User>, password: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  }
  @instanceMethod
  validatePassword(this: InstanceType<User>, password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  }
  @instanceMethod
  generateJWT(this: InstanceType<User>): any {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: (expirationDate.getTime() / 1000, 10),
    }, 'secret');
  }
  @instanceMethod
  toAuthJSON(): any {
    return {
      email: this.email,
      token: this.generateJWT(),
    };
  };
}
const UserModel = new User().getModelForClass(User);

export { User, UserModel }
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as LocalStrategy  from 'passport-local';
import { UserModel } from '../models/User';

passport.use(new LocalStrategy({usernameField: 'user[email]', passwordField: 'user[password]'}, (email, password, done) => {
  UserModel.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(err => {
      console.log(err);
    });
}));
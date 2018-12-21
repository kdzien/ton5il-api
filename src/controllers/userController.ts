import { UserModel } from '../models/User';
import { Request, Response } from 'express';
import * as passport from 'passport';
import { auth } from '../config/auth';
declare const next: any
export const registerUser = async (req: Request, res: Response) => {
  try{
    const new_user = new UserModel({
      name:"Konrad Dzień",
      email:"dzieniu@gmail.com"
    });
  
    new_user.setPassword("apteka13");
    await new_user.save();
    res.json({ user: new_user.toAuthJSON()})
  }catch(err){
    res.send(err)
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
}

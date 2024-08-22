import { User,Owner,PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import express,{Request,Response,NextFunction} from 'express';
import process from 'process';
import {IGetAuthRequest} from '../utils/types/req';
import {JwtPayload} from '../utils/types/jwt';


export async function authUserTest(req:IGetAuthRequest,res:Response,next:NextFunction) {
    const userToken = req.signedCookies['refreshToken'];
    if(!userToken){
        return res.redirect('/user/login');
    };
    try{
        const refreshTokenKey = process.env.REFRESHTOKEN
        const verifyToken = jwt.verify(userToken,refreshTokenKey);
        if(!verifyToken){
            return res.redirect('/owner/login');
        }

        const decodeToken = jwt.decode(userToken) as JwtPayload;
        const userId = decodeToken.id;

        const user:User = await prisma.user.findUnique({where:{id:+userId}});
        if(!user){
            return res.redirect('/user/login');
        };

        req.userId = user.id;
        req.user = user;
        next();
    }catch(e){
        return res.status(419).json({message:e});
    }
}

export async function authUser(req:IGetAuthRequest,res:Response,next:NextFunction) {
    const authHeader:string = req.headers.authorization;
    if(!authHeader){
        return res.status(422).json({message:'توکن کاربر ارسال نشده است!',isOk:false});
    }
    const userToken = authHeader.split(' ')[1];
    if(!userToken){
        return res.redirect('/user/login');
    };
    try{
        const refreshTokenKey = process.env.REFRESHTOKEN
        const verifyToken = jwt.verify(userToken,refreshTokenKey);
        if(!verifyToken){
            return res.redirect('/owner/login');
        }

        const decodeToken = jwt.decode(userToken) as JwtPayload;
        const userId = decodeToken.id;

        const user:User = await prisma.user.findUnique({where:{id:+userId}});
        if(!user){
            return res.redirect('/user/login');
        };

        req.userId = user.id;
        req.user = user;
        next();
    }catch(e){
        return res.status(419).json({message:e});
    }
}

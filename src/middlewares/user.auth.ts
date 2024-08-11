import { User,Owner,PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import express,{Request,Response,NextFunction} from 'express';
import process from 'process';
import {IGetAuthRequest} from '../utils/types/req';
import {JwtPayload} from '../utils/types/jwt';


export async function authUser(req:IGetAuthRequest,res:Response,next:NextFunction) {
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

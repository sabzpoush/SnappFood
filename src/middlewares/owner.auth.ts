import { Owner, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import express,{Request,Response,NextFunction} from 'express';
import process from 'process';
import {IGetAuthRequest} from '../utils/types/req';
import {JwtPayload} from '../utils/types/jwt';


export async function authOwner(req:IGetAuthRequest,res:Response,next:NextFunction) {
    const ownerToken = req.signedCookies['refreshToken'];
    if(!ownerToken){
        return res.redirect('/owner/login');
    };
    try{
        const refreshTokenKey = process.env.REFRESHTOKEN
        const verifyToken = jwt.verify(ownerToken,refreshTokenKey);
        if(!verifyToken){
            return res.redirect('/owner/login');
        }

        const decodeToken = jwt.decode(ownerToken) as JwtPayload;
        const ownerId = decodeToken.id;

        const owner:Owner = await prisma.owner.findUnique({where:{id:+ownerId}});
        if(!owner){
            return res.redirect('/owner/login');
        };

        req.ownerId = owner.id;
        req.owner = owner;
        next();
    }catch(e){
        return res.status(419).json({message:e});
    }
}

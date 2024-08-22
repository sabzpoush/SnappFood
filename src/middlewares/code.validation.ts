import express,{Express,Request,Response,NextFunction} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {IGetAuthRequest} from '../utils/types/req';


export async function validateEmailTest(req:IGetAuthRequest,res:Response,next:NextFunction){
    const emailToken = req.signedCookies['emailToken'];
    if(!emailToken){
        return res.status(422).json({message:'لطفا یکبار دیگر برای احراز ایمیل خود درخواست دهید!'});
    };

    try{
        const key:string = process.env.EMAIL_TOKEN;
        const verifyEmail = jwt.verify(emailToken,key);
        if(!verifyEmail){
            return res.status(422).json({message:'توکن نامعتبر است!'});
        }
        const decodeEmail = jwt.decode(emailToken) as JwtPayload;
        const email:string = decodeEmail.email;

        const existEmail = await prisma.user.findFirst({where:{email}});
        if(!existEmail){
            return res.status(422).json({message:'این ایمیل قبلا استفاده شده است!'});
        }

        req.email = email;
        return next();
    }catch(e){
        return res.status(422).json({message:'در اعتبار سنجی کد شما مشکلی رخ داد!'});
    }
}


export async function validateEmail(req:IGetAuthRequest,res:Response,next:NextFunction){
    const authHeader:string = req.headers['authorization'] as string;
    console.log(req.header,req.headers);
    
    const emailToken = authHeader.split(' ')[1];
    if(!emailToken){
        return res.status(422).json({message:'لطفا یکبار دیگر برای احراز ایمیل خود درخواست دهید!'});
    };
    const {userCode} = req.body;
    try{
        const key:string = process.env.EMAIL_TOKEN;
        const verifyEmail = jwt.verify(emailToken,key);
        if(!verifyEmail){
            return res.status(422).json({message:'توکن نامعتبر است!'});
        }
        const decodeEmail = jwt.decode(emailToken) as JwtPayload;
        const email:string = decodeEmail.email;
       
        // const existEmail = await prisma.user.findFirst({where:{email}});
        // if(existEmail){
        //     return res.status(422).json({message:'این ایمیل قبلا استفاده شده است!'});
        // }

        
        const code = decodeEmail.code;
        console.log(code,userCode);
        if(code != userCode){
            return res.status(422).json({message:'کد تایید وارده شده اشتباه است!'});
        }

        req.email = email;
        return next();
    }catch(e){
        return res.status(422).json({message:'در اعتبار سنجی کد شما مشکلی رخ داد!'});
    }
}


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express,{Express,Request,Response,NextFunction} from 'express';
import {makeCode} from '../../utils/helper/codeMaker';
import {sendCode} from '../../utils/helper/send.email';
import {emailToken} from '../../utils/token/jwt.token';
import jwt,{JwtPayload} from 'jsonwebtoken';

export async function verifyEmail(req:Request,res:Response) {
    const {email} = req.body;

    // const checkEmail = await prisma.user.findFirst({where:{email}});
    // if(checkEmail){
    //     return res.status(419).json({message:'این ایمیل قبلا ثبت شده است!'});
    // }

    sendCode(email)
        .then((code:string)=>{
            const tokenEmail = emailToken({email,code});

            // res.cookie('email',tokenEmail,{
            //     secure:true,
            //     httpOnly:true,
            //     signed:true,
            //     maxAge:300000, 
            // });
            return res
                .status(200)
                .json({message:`کد تایید ارسال شده به ایمیل ${email} را وارد نمایید`,token:tokenEmail,code});
        })
        .catch((e)=>{
            return res
                .status(422)
                .json({message:'در ارسال ایمیل برای شما دچار مشکل شدیم',error:e})
        });
}

export async function rememberMe(req:Request,res:Response){
    const reqHeader = req.headers.authorization;
    if(!reqHeader){
        return res.status(422).json({message:'توکن کاربر یافت نشد!',isOk:false});
    }
    const authHeader = reqHeader.split(' ')[1];
    if(!authHeader){
        return res.status(422).json({message:'توکن کاربر صحیح نیست!',isOk:false});
    } 

    try{
        const key = process.env.REFRESHTOKEN;
        const verifyToken = jwt.verify(authHeader,key);
        if(!verifyToken){
            return res.status(422).json({message:'اعتبار توکن شما تمام شده است!',isOk:false});
        }
        const decodeToken = jwt.decode(authHeader) as JwtPayload;
        const id = decodeToken.id;
        const user = await prisma.user.findUnique({where:{id:+id}});
        if(!user){
            return res.status(422).json({message:'کاربری با این توکن وجود ندارد!ْ',isOk:false});
        }
        return res.status(200).json({message:'توکن معتبر است!',isOk:true,user});
    }catch(e){
        return res
            .status(422)
            .json({message:'در اعتبار سنجی توکن کاربر مشکلی رخ داد!',isOk:false});
    }
}

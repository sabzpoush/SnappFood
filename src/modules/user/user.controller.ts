import {User,PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import express,{Request,Response,NextFunction,Express} from "express";
import * as bcrypt from 'bcrypt';
import * as token from '../../utils/token/jwt.token';
import { IGetAuthRequest } from 'src/utils/types/req';


export async function signUpOrSignIn(req:IGetAuthRequest,res:Response){
    const email = req.email;
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        const user = await prisma.user.create({
            data:{
                email,
            }
        });
        if(!user){
            return res.status(422).json({message:'در ثبت نام شما مشکلی بوجود امد!'});
        }
    
        const refreshToken = token.refreshToken({id:user.id});
        const userToken = await prisma.user.update({
            where: {id:user.id},
            data: {refreshToken},
        });
        if(!userToken){
            return res.status(422).json({message:'حساب کاربری شما ایجاد لطفا دوباره به حساب خود وارد شوید!'});
        }
        res.cookie('refreshToken',refreshToken);
    
        return res.status(201).json({...user,refreshToken});
    }

    const refreshToken = token.refreshToken({id:user.id});
    const userToken = await prisma.user.update({where:{id:user.id},data:{refreshToken}});
    if(!userToken){
        return res.status(422).json({message:'خطایی رخ داد لطفا مجددا وارد شوید!'});
    }

    res.cookie('refreshToken',refreshToken,{
        secure:true,
        httpOnly:true,
        signed:true,
        maxAge:300000,
    });
    return res.status(200).json({...user,refreshToken});
}

export async function signUp(req:IGetAuthRequest,res:Response) {
    const email = req.email;

    const userExsit = await prisma.user.findFirst({where:{email}});
    if(userExsit){
        return res
            .status(422)
            .json({message:'ایمیل یا شماره موبایل قبلا در سایت ثبت شده است!'});
    }

    
    const user = await prisma.user.create({
        data:{
            email,
        }
    });
    if(!user){
        return res.status(422).json({message:'در ثبت نام شما مشکلی بوجود امد!'});
    }

    const refreshToken = token.refreshToken({id:user.id});
    const userToken = await prisma.user.update({
        where: {id:user.id},
        data: {refreshToken},
    });
    if(!userToken){
        return res.status(422).json({message:'حساب کاربری شما ایجاد لطفا دوباره به حساب خود وارد شوید!'});
    }
    res.cookie('refreshToken',refreshToken);

    return res.status(201).json({...user,refreshToken:userToken.refreshToken});
};

export async function singIn(req:IGetAuthRequest,res:Response){
    const email = req.email;
    const user = await prisma.user.findFirst({where:{email}});
    if(!user){
        return res.status(422).json({message:'کاربری با این ایمیل یافت نشد!'});
    }


    const refreshToken = token.refreshToken({id:user.id});
    const userToken = await prisma.user.update({where:{id:user.id},data:{refreshToken}});
    if(!userToken){
        return res.status(422).json({message:'خطایی رخ داد لطفا مجددا وارد شوید!'});
    }

    res.cookie('refreshToken',refreshToken,{
        secure:true,
        httpOnly:true,
        signed:true,
        maxAge:300000,
    });
    return res.status(200).json({userToken,refreshToken});
}

export async function resetPassword(req:Request,res:Response){}

export async function editProfile(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const {fullName,phone} = req.body;

    const editUser =  await prisma.user.update(
        {where:{id:+userId},
        data:{fullName:fullName || '',phone:phone || ''}
    });
    if(!editUser){
        return res.status(422).json({message:'در ویرایش مشخصات کاربر مشکلی رخ داد!'});
    }

    return res
        .status(203)
        .json({message:'مشخصات کاربر ویرایش شد!',...editUser});
}
import {User,PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import express,{Request,Response,NextFunction,Express} from "express";
import * as bcrypt from 'bcrypt';
import * as token from '../../utils/token/jwt.token';

export async function signUp(req:Request,res:Response) {
    const {
        fullName,
        email,
        phone,
        password } = req.body;
    
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password,salt);

    const userExsit = await prisma.user.findFirst({where:{OR:[{email},{phone}]}});
    if(userExsit){
        return res
            .status(422)
            .json({message:'ایمیل یا شماره موبایل قبلا در سایت ثبت شده است!'});
    }

    
    const user = await prisma.user.create({
        data:{
            fullName,
            email,
            phone,
            password: hashPassword,
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

export async function singIn(req:Request,res:Response){
    const {email,password} = req.body;
    const user = await prisma.user.findFirst({where:{email}});
    if(!user){
        return res.status(422).json({message:'کاربری با این ایمیل یافت نشد!'});
    }

    const matchPassword = bcrypt.compareSync(password,user.password);
    if(!matchPassword){
        return res.status(419).json({message:'رمز عبور وارد شده اشتباه است!'});
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
    return res.status(200).json(userToken);
}

export async function resetPassword(req:Request,res:Response){}
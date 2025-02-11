import { Owner, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import {Request,Response} from 'express';
import bcrypt from 'bcrypt';
import * as token from '../../utils/token/jwt.token';
import { IGetAuthRequest } from '../../utils/types/req';


export async function register (req:Request,res:Response) {
    const {email,fullName,password,phone,city,state} = req.body;

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password,salt);

    const owner = await prisma.owner.create({data:
        {email,fullName,password:hashedPassword,phone,city,state,}
    });
    if(!owner){
        return res.status(422).json({message:'ثبت نام ادمین با خطا مواجه شد!'});
    }

    const refreshToken = token.refreshToken({id:owner.id});
    const setRefreshToken = await prisma.owner.update({where:{id:owner.id},data:{refreshToken}});
    if(!setRefreshToken){
        return res
            .status(203)
            .json({message:'ثبت نام شما با موفقیت انجام شد! می توانید به حساب کاربری خود وارد شوید.'});
    };

    res.cookie('refreshToken',refreshToken,{
        secure:true,
        httpOnly:true,
        signed:true,
        maxAge:300000,
    });
    return res.status(201).json(owner);
}

export async function allUsers(req:Request,res:Response) {
    const owners = await prisma.owner.findMany({});
    if(owners.length === 0){
        return res.status(422).json({message:'مشکلی پیش امده است!ز'});
    }
    res.status(200).json(owners);
}

export async function singIn(req:Request,res:Response){
    const {ownerIdentifier,password} = req.body;
    const owner = await prisma.owner.findFirst(
        {
            where:{
                OR:[
                    {email:ownerIdentifier},
                    {phone:ownerIdentifier}
                ]   
            },
        });

    if(!owner){
        return res
            .status(422)
            .json({message:'ادمینی با این ایمیل یا شماره موبایل یافت نشد!'});
    }

    const checkPassword = bcrypt.compare(password,owner.password);
    if(!checkPassword){
        return res
            .status(422)
            .json({message:'رمز عبور نامعتبر است!'});
    }

    const refreshToken = token.refreshToken({id:owner.id});
    const setRefreshToken = await prisma.owner.update({where:{id:owner.id},data:{refreshToken}});
    if(!setRefreshToken){
        return res.status(422).json({message:'عملیات ورود با خطا مواجه شد!'});
    }

    res.cookie('refreshToken',refreshToken,{
        secure:true,
        httpOnly:true,
        signed:true,
        maxAge:300000,
    });
    delete setRefreshToken.password;
    res.status(200).json({...setRefreshToken});
};

export async function resetPassword(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;
    
    const {newPassword} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword,salt);

    const ownerRestPassword = await prisma.owner.update({
        where:{id:ownerId},
        data:{password:hashedPassword},
        select:{password:false}
    });
    if(!ownerRestPassword){
        return res.status(422).json({message:'در تغییر رمز عبور مشکلی پیش امد!'});
    };

    res.status(200).json({message:'رمز عبور کاربر با موفقیت تغییر کرد!',owner:ownerRestPassword});
}
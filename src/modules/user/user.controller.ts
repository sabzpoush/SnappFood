import {User,PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import express,{Request,Response,NextFunction,Express} from "express";
import * as bcrypt from 'bcrypt';
import * as token from '../../utils/token/jwt.token';
import { IGetAuthRequest } from 'src/utils/types/req';


// Helper function to validate email format
function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

const SALT_ROUNDS = 10;  // Define the number of salt rounds for bcrypt

export async function signUpOrSignIn(req: IGetAuthRequest, res: Response) {
    try {
        const { email } = req.body;

        // Validate email format
        if (!email || !validateEmail(email)) {
            return res.status(400).json({ message: 'ایمیل معتبر نمی‌باشد!' });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create a new user with hashed password (if applicable)
            user = await prisma.user.create({
                data: {
                    email,
                },
            });

            if (!user) {
                return res.status(500).json({ message: 'در ثبت نام شما مشکلی بوجود آمد!' });
            }
        }

        // Generate refresh token
        const refreshToken = token.refreshToken({ id: user.id });

        // Update user with the new refresh token
        const userToken = await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        if (!userToken) {
            return res.status(500).json({ message: 'خطایی رخ داد لطفا مجددا وارد شوید!' });
        }

        // Set secure HTTP-only cookie with the refresh token
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV === 'production',  // Only secure in production
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000,  // 1 day expiration
        });

        return res.status(user ? 200 : 201).json({
            id: user.id,
            email: user.email,
            refreshToken,
        });
    } catch (error) {
        console.error('Error during sign up/sign in:', error);
        return res.status(500).json({ message: 'خطایی در عملیات ورود/ثبت‌نام رخ داد!', error });
    }
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
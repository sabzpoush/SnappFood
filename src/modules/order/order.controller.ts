import {Cart,Product,Restaurant,User,Owner,Order, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {IGetAuthRequest} from '../../utils/types/req';
import express,{Request,Response,NextFunction} from 'express';


export async function createOrder(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const cart:Cart[] = await prisma.cart.findMany({
        where:{userId:userId},
        include:{
            product:true,
        }
    });
    if(cart.length === 0){
        return res.status(422).json({message:'شما کالایی جهت سفارش انتخاب نکرده اید!'});
    }

    

}

export async function submitOrder(req:IGetAuthRequest,res:Response){

}

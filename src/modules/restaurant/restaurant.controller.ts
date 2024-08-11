import { Restaurant,Owner, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express,{Express,Request,Response,NextFunction} from 'express';
import {IGetAuthRequest} from '../../utils/types/req';


export async function createRest(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner = req.owner;
    console.log(owner);
    
    const exsitRest = await prisma.restaurant.findUnique({where:{ownerId:ownerId}});
    if(exsitRest){
        return res
            .status(422)
            .json({message:'قبلا رستورانی بنام این ادمین ثبت شده است!'});
    }

    const {
        address,
        title,
        workTime,
        body,
        description,
        href,
        phone } = req.body;

    const rest = await prisma.restaurant.create({
        data:{
            address,
            title,
            workTime,
            body,
            description,
            href,
            phone,
            owner:{
                connect:{
                    id:ownerId,
                }
            }
        },
    });
    if(!rest){
        return res
            .status(422)
            .json({message:'ساخت رستوارن شما با خطا مواجه شد'});
    }

    res.status(201).json(rest);
};

export async function ownerSelfRest(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner = req.owner;

    const selfRest = await prisma.restaurant.findUnique({where:{ownerId}});
    if(!selfRest){
        return res
            .status(422)
            .json({message:'رستورانی هنوز بنام شما ثبت نشده است!'});
    }

    res.status(200).json(selfRest);
};

export async function allRestaurant(req:Request,res:Response) {
    const restarurants = await prisma.restaurant.findMany({
        include:{
            owner:true
        }
    });

    if(restarurants.length === 0 ){
        return res.status(422).json({message:'رستورانی در سایت ثبت نشده است!'});
    }

    res.status(200).json(restarurants);
};

export async function searchRestaurant(req:Request,res:Response){
    const {search} = req.body;
    const rest = await prisma.restaurant.findMany({where:{title:{contains:search}}});
    if(rest.length === 0){
        return res.status(422).json({message:'رستورانی با این نام پیدا نشد!'});
    };

    return res.status(200).json({restaurant:rest});
}
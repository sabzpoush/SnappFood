import express,{Request,Response,NextFunction} from 'express';
import { Owner,Restaurant,Category,Product,User, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {IGetAuthRequest} from '../../utils/types/req';
import {calcScore} from '../../utils/helper/calculator_score';

export async function restaurantMenu(req:Request,res:Response){
   const { id } = req.query;

    let restaurant = await prisma.restaurant.findUnique({where:{id:+id}});
    if(!restaurant){
        return res.status(422).json({message:'در بارگذاری رستوران مشکلی پیش امد!'});
    };

    const category:Category[] = await prisma.category.findMany({
        where:{ restaurantId:restaurant.id },
        include:{ Product:true }
    });
    if(category.length === 0){
        return res
            .status(422)
            .json({message:'در بارگذاری دسته بندی های رستوران مشکلی پیش امد!'});
    }

    await prisma.restaurant.update({
        where:{id:+id},
        data:{watchCount:{increment:1}
    }});
    
    restaurant = calcScore(restaurant);
    return res.status(200).json({restaurant,category});
};

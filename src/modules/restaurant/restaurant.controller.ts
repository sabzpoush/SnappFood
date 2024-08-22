import { Restaurant,Owner, PrismaClient, Order } from '@prisma/client';
const prisma = new PrismaClient();
import express,{Express,Request,Response,NextFunction} from 'express';
import {IGetAuthRequest} from '../../utils/types/req';
import {calcTotalScoreMultipleRest,calcMultipleScore} from '../../utils/helper/calculator_score';


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
            owner:false
        }
    });

    if(restarurants.length === 0 ){
        return res.status(422).json({message:'رستورانی در سایت ثبت نشده است!'});
    }

    //const avgScore = calcMultipleScore(restarurants);
    const totalScore = calcTotalScoreMultipleRest(restarurants);

    res.status(200).json(totalScore);
};

export async function searchRestaurant(req:Request,res:Response){
    const {search} = req.body;
    const rest = await prisma.restaurant.findMany({where:{title:{contains:search}}});
    if(rest.length === 0){
        return res.status(422).json({message:'رستورانی با این نام پیدا نشد!'});
    };

    return res.status(200).json({restaurant:rest});
}

export async function giveScore(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;
    
    let {restId,score} = req.body;

    score = Number(score).toFixed(1);
    const restaurant = await prisma.restaurant.update({
        where: {id:+restId},
        data: {
            score:{
                push:+score,
            }
        },
    });
    if(!restaurant){
        return res.status(422).json({message:'رستوران مورد نظر شما یافت نشد!'});
    };

    return res.status(200).json({restaurant});
}

export async function topScoreRestaurant(req:Request,res:Response) {
    const restarurants = await prisma.restaurant.findMany({});
    if(restarurants.length=== 0){
        return res.status(422).json({message:'رستورانی در سایت ثبت نشده است!'})
    };

    const calcutRest = calcTotalScoreMultipleRest(restarurants);
    calcutRest.sort((a:any,b:any)=> b.avgScore - a.avgScore);

    return res.status(200).json(calcutRest);
}

export async function topViewedRestaurant(req:Request,res:Response){
    const restaurants = (await prisma.restaurant.findMany({})).sort((a,b)=> b.watchCount - a.watchCount);
    if(restaurants.length === 0){
        return res.status(422).json({message:'رستورانی در سایت وجود ندارد!'});
    }

    return res.status(200).json(restaurants);
}

export async function topOrderCountRestaurant(req:Request,res:Response){
    const orders = (await prisma.order.findMany()).sort((a,b)=>a.restaurantId - b.restaurantId);
    if(orders){
        return res.status(422).json({message:'سفارشی در رستوران ثبت نشده است!'});
    }

    const restaurants = await prisma.restaurant.findMany();
    if(restaurants.length === 0){
        return res.status(422).json({message:'رستورانی در سایت ثبت نشده است!'});
    }
    let orderCount = 0;
    let topRest = [];
    restaurants.forEach((rest:Restaurant)=>{
        orders.forEach((order:Order)=>{
            if(+rest.id === +order.restaurantId){
                orderCount +=1;
            }
        });
        topRest.push({...rest,orderCount});
    });

    topRest.sort((a:any,b:any)=> b.orderCount - a.orderCount);

    return res.status(422).json(topRest);
}

export async function changeDeliveryPrice(req:IGetAuthRequest,res:Response){
    const ownerId = req.ownerId;
    const owner =  req.owner;

    const {price} = req.body;

    const restaurant = await prisma.restaurant.update({
        where:{ownerId:+ownerId},
        data:{delivery:+price}
    });
    if(!restaurant){
        return res
            .status(422)
            .json({message:'در تغییر قیمت ارسال پیک مشکلی پیش امد!'});
    }

    return res
        .status(203)
        .json({message:`قیمت پیک رستوران شما به ${price} تغییر یافت!`,restaurant});
}
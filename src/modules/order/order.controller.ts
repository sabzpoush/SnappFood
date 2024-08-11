import {Cart,Product,Restaurant,User,Owner,Order, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {IGetAuthRequest} from '../../utils/types/req';
import express,{Request,Response,NextFunction} from 'express';


export async function createOrder(req:IGetAuthRequest,res:Response){
    try{
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
        let sumPrice = 0;
        cart.sort((rest1,rest2)=> rest1.restaurantId - rest2.restaurantId);
        cart.forEach((item:Cart)=>{
            sumPrice += (+item.count * +item.price);
        });
        
        return res
            .status(201)
            .json({
                cart,
                totalPrice:sumPrice,
                productCount:cart.length
            });
    }catch(e){
        return res.status(419).json({error:e});
    }
}

export async function submitOrder(req:IGetAuthRequest,res:Response){
    try{
        const userId:number = req.userId;
        const user:User = req.user;
    
        const {address,note} = req.body;
    
        const carts = await prisma.cart.findMany({
            where:{userId:userId},
            include:{
               product:true,
            },
        });
        if(carts.length === 0){
            return res.status(422).json({message:'شما کالایی جهت سفارش انتخاب نکرده اید!'});
        }
        carts.sort((rest1,rest2)=> rest1.restaurantId - rest2.restaurantId);
        let totalPrice:number = 0;
        let currentRestaurnat;
        let orders:myOrder;
        let step:number = 0;
        const time = Date.now();
        carts.forEach(async(cart,index:number)=>{
            if(!currentRestaurnat){
                totalPrice += (+cart.count * +cart.price);
                orders = {products:[cart.product],totalPrice};
                currentRestaurnat = cart.restaurantId;
            }
            if(currentRestaurnat === cart.restaurantId){
                totalPrice += (+cart.count * +cart.price);
                const products:Product[] = [cart.product,...orders.products];
                orders = {products,totalPrice};
                
            }else{
                const order = await prisma.order.create({
                    data:{
                        restaurant:{
                            connect:{
                                id:currentRestaurnat,
                            },
                        },
                        user:{
                            connect:{
                                id:userId,
                            },
                        },
                        products:orders.products,
                        price:orders.totalPrice,
                        count:cart.count,
                        note,
                        address,
                        time,
                    },
                });
                if(!order){
                    return res
                        .status(422)
                        .json({message:'در ثبت سفارش شما مشکلی رخ داده است!'});
                }
                totalPrice += (+cart.count * +cart.price);
                orders.totalPrice = totalPrice;
                orders.products.push(cart.product);
                currentRestaurnat = cart.restaurantId;
            }
            if((index + 1) === carts.length && index !== 0){
                totalPrice += (+cart.count * +cart.price);
                orders.totalPrice = totalPrice;
                orders.products.push(cart.product);
                currentRestaurnat = cart.restaurantId;
                await prisma.order.create({
                    data:{
                        restaurant:{
                            connect:{
                                id:currentRestaurnat,
                            },
                        },
                        user:{
                            connect:{
                                id:userId,
                            },
                        },
                        products:orders.products,
                        price:orders.totalPrice,
                        count:cart.count,
                        note,
                        address,
                        time,
                    },
                });
                // if(!lastOrder){
                //     //await prisma.order.deleteMany({where:{time}});
                //     return res
                //         .status(422)
                //         .json({message:'در ثبت سفارش شما مشکلی رخ داده است!'});
                // }
            }
        });
    const submitedOrders = await prisma.order.findMany({
        where:{time}
    });
    if(submitOrder.length === 0){
        return res.status(422).json({message:'سفارش شما ثبت نشده است!'});
    }
    await prisma.cart.deleteMany({where:{userId}});
    
    return res
        .status(201)
        .json(submitedOrders);
    }catch(e){
        return res.status(419).json({error:e});
    }
}

export async function allOrders(req:Request,res:Response) {
    const orders = await prisma.order.findMany({});
    const allOrders = [];
    orders.forEach((order:Order)=>{
        allOrders.push(excludeField(order,'time'));
    });

    return res.status(200).json(allOrders);
}

type ExcludeField<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};
  
// Function to exclude a specific field
function excludeField<T, K extends keyof T>(fields: T, fieldToExclude: K): ExcludeField<T, K> {
    const { [fieldToExclude]: _, ...remainingFields } = fields;
    return remainingFields as ExcludeField<T, K>;
}

type myOrder = {
    products:Product[],
    totalPrice:number
}
function addOrders(totalPrice:number,product:Product):myOrder{
    return {
        products:[product],
        totalPrice,
    }
}

async function test(){
    const carts:Cart[] = await prisma.cart.findMany({include:{product:true,restaurant:true,user:true}});
    if(carts.length === 0){
        console.log(carts);
        return false;
    }
    
    console.log(carts);
}
console.log(Date.now());

// test();
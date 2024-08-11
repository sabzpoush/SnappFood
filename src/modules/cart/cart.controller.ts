import {Cart,Product,Restaurant,User, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import express,{Request,Response,NextFunction} from 'express';
import { IGetAuthRequest } from '../../utils/types/req';


export async function addToCart(req:IGetAuthRequest,res:Response) {
    const userId = req.userId;
    const user = req.user;
    console.log(userId);
    
    const {productId} = req.body;
    const product = await prisma.product.findUnique({where:{id:+productId}});
    if(!product){
        return res.status(422).json({message:'محصول انتخابی شما نامعتبر است!'});
    }
    
    const restaurant = await prisma.restaurant.findFirst({where:{id:product.restId}});
    if(!restaurant){
        return res.status(422).json({message:'این محصول در رستوران مورد نظر موجود نیست!'});
    };
    const checkCart = await prisma.cart.findFirst({
        where:{
            AND:[
                {userId},
                {restaurantId:restaurant.id},
                {products:productId}
            ]
        }
    });
    if(checkCart){
        let count = checkCart.count + 1;
        let price = product.price * count;
        const addCart = await prisma.cart.update({
            where:{ id:checkCart.id },
            data:{
                count,
                price
            }
        })
        if(!addCart){
            return res.status(422).json({message:'در اضافه کردن مجدد محصول مشکلی رخ داده است!'});
        }

        return res.status(203).json({message:`محصول ${product.title} به سبد خرید شما اضافه گردید!`})

    };

    const cart:Cart = await prisma.cart.create({
        data:{
            restaurant:{
                connect:{
                    id:restaurant.id
                }
            },
            user:{
                connect:{
                    id:+userId
                }
            },
            product:{
                connect:{
                    id:product.id
                }
            },
            count:1,
            price:product.price
        }
    });
    if(!cart){
        return res.status(422).json({message:'در ایجاد سبد خرید شما مشکلی پیش امد!'});
    }

    return res.status(200).json(cart);
}

export async function myCart(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const cart = await prisma.cart.findMany({
        where:{userId},
        include:{restaurant:true, user:true, product:true}
    });
    if(cart.length === 0){
        return res.status(422).json({message:'سبد خرید شما خالی است!'});
    }

    res.status(200).json(cart);
}

export async function detailOfCart(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const cart = await prisma.cart.findMany({
        where:{
            userId,
        },
        include:{
            restaurant:true,
            user: true,
            product: true,
        },
    });
    if(cart.length === 0){
        return res.status(422).json({message:'سبد خرید شما خالی است!'});
    }

    let result = [];
    let index = 0;
    let currentRest:number;
    cart.sort((a,b)=>{
        return a.restaurantId - b.restaurantId;
    });
    cart.forEach((item)=>{     
        const cartShop = {   
            restaurant:{
                title: item.restaurant.title,
                href: item.restaurant.href,
                logo: item.restaurant.logo,
                picture: item.restaurant.picture,
                banner: item.restaurant.banner,
            },
            products:[],
        }
        if(!currentRest){
        result.push(cartShop);
        result[index].products.push({...item.product,price:item.price,count:item.count});
        }else{
            if(currentRest === item.restaurantId){
                result[index].products.push({...item.product,price:item.price,count:item.count});
            }else{
                if(!item.product){
                    index =+ 1;
                    result.push(cartShop);
                    result[index].products.push({...item.product,count:item.count,price:item.price});
                }
            }
        }
        currentRest = item.restaurantId;
    });

    return res.status(200).json(result);
}

export async function clearCart(req:IGetAuthRequest,res:Response) {
    const userId = req.userId;
    const user = req.user;

    const cart = await prisma.cart.deleteMany({where:{userId}});
    if(!cart){
        return res.status(422).json({message:"لطفا بار دیگر تلاش کنید!"});
    }
    
    return res.status(203).json({message:'سبد خرید شما خالی شد!'});
}

export async function deleteFromCart(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const {productId} = req.body;
    const product = await prisma.product.findUnique({
        where:{id:productId}
    });
    if(!product){
        return res.status(422).json({message:'این محصول از فروشگاه حذف شده است!'});
    }

    const firstCart = await prisma.cart.findFirst({
        where:{
            AND:[
                { userId },
                { products:productId }
            ]
        }
        });
    if(!firstCart){
        return res.status(422).json({message:'خطایی رخ داد! دوباره تلاش کنید.'});
    }

    const cart = await prisma.cart.delete({
        where:{id:firstCart.id}
    });
    if(!cart){
        return res.status(422).json({message:'در حذف محصول مشکلی رخ داده است دوباره تلاش کنید!'});
    }

    return res.status(203).json({message:`آیتم ${product.title} از سبد خرید شما حذف شد!`});
}

export async function decreaseProductCount(req:IGetAuthRequest,res:Response){
    const userId = req.userId;
    const user = req.user;

    const {productId} = req.body;
    const product = await prisma.product.findUnique({where:{id:productId}});
    if(!product){
        return res.status(422).json({message:'محصول مورد نظر شما یافت نشد!'});
    }

    const cart = await prisma.cart.findFirst({where:{AND:[{userId},{products:productId}]}});
    if(!cart){
        return res.status(422).json({message:'سبد خرید شما یافت نشد!'});
    }

    let count = cart.count - 1;
    let price = cart.price - (product.price);
    if(count <= 0){
        const removeOfCart = await prisma.cart.delete({where:{id:cart.id}});
        if(!removeOfCart){
            return res.status(422).json({message:'در حذف محصول از سبد خرید مشکلی پیش امد!'});
        }

        return res.status(203).json({message:'محصول از سبد خرید شما حذف شد!'});
    }

    const removeFromCart = await prisma.cart.update({where:{id:cart.id},data:{count,price}});
    if(!removeFromCart){
        return res.status(422).json({message:'در کاهش تعداد محصول مشکلی رخ داده است!'});
    }

    return res.status(200).json({message:`یک عدد از ${product.title} کم شد!`});
}
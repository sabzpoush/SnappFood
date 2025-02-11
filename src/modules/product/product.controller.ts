import { Owner,PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express,{Request,Response,Express,NextFunction} from 'express';
import { IGetAuthRequest } from '../../utils/types/req';
import {findMostRepeatedItem} from '../../utils/helper/findSome';


export async function newProduct(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;

    const ownerRest = await prisma.restaurant.findFirst({where:{ownerId:ownerId}});
    const {
        title,
        description,
        price,
        categoryId } = req.body;

    const category = await prisma.category.findFirst({where:{id:+categoryId}});
    if(!category){
        return res.status(422).json({message:'دسته بندی محصول وارد شده نا معتبر است'});
    }
    if(category.restaurantId !== ownerRest.id){
        return res.status(422).json({message:'دسته بندی انتخابی متعلق به رستوران دیگری است!'});
    }

    const product = await prisma.product.create({
        data:{
            title,
            description,
            price:+price,
            restaurant:{
                connect:{
                    id:ownerRest.id,
                }
            },
            category:{
                connect:{
                    id:categoryId,
                }
            }
        }
    });
    if(!product){
        return res.status(422).json({message:'در ایجاد محصول دچار مشکل شدیم!'});
    }

    res.status(201).json(product);
}

export async function deleteProduct(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;

    const {productId} = req.query;
    const ownerRest = await prisma.restaurant.findFirst({
        where:{
            ownerId,
        }
    }); 

    const product = await prisma.product.delete({
        where:{
            id:+productId,
            AND:[
                {restId:ownerRest.id},
                {}
            ]
        },
    });
    if(!product){
        return res
            .status(422)
            .json({message:'حذف محصول انتخابی شما با خطا مواجه شد!'});
    }
    res.status(203).json(product);
}

export async function selfRestProduct(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owenr:Owner = req.owner;

    const ownerRest = await prisma.restaurant.findFirst({where:{ownerId:+ownerId}});
    if(!ownerRest){
        return res.status(422).json({message:'رستورانی هنوز بنام شما ثبت نشده است!'});
    }

    const selfProduct = await prisma.product.findMany({where:{restId:ownerRest.id}});
    if(selfProduct.length === 0){
        return res
            .status(422)
            .json({message:'هنوز محصولی در رستوان خود ثبت نکرده اید!'});

    }

    return res.status(200).json(selfProduct);
}


export async function changeProductPrice(req:IGetAuthRequest,res:Response){
    const ownerId:number = req.ownerId;
    const owner:Owner = req.owner;

    const {
        productId,
        price } = req.body;
    const productExist = await prisma.product.findUnique({where:{id:+productId}});
    if(!productExist){
        return res.status(422).json({message:'محصول انتخابی شما موجود نیست!'});
    }

    const productNewPrice = await prisma.product.update({
        where:{id:productExist.id},
        data:{price:+price}
    });
    if(!productNewPrice){
        return res.status(422).json({message:'تغییر قیمت محصول شما با خطا مواجه شد!'});
    }

    const title:string = productNewPrice.title;
    const newPrice:string = String(productNewPrice.price);
    return res
        .status(203)
        .json({
            message:`قیمت محصول ${title} به مقدار ${newPrice} تغییر یافت!`
        });
}

export async function topPurchasedProduct(req:Request,res:Response){
    const products = await prisma.product.findMany();
    if(products.length === 0){
        return res.status(422).json({message:'محصولی در سایت موجود نیست!'});
    }
    const orders = await prisma.order.findMany({});
    if(orders.length === 0){
        return res.status(422).json({message:'سفارشی در سایت ثبت نشده است!'});
    }

    let result = [];
    orders.forEach((order)=>{
        order.products.forEach((item:any)=>{
            const id:number = Number(+item.id);
            result.push(id);
        });        
    });
    
    let topProducts = []
    for(let i = 1;i <= 4;i++){
        const topProduct = Number(findMostRepeatedItem(result));
        result = result.filter((item)=>{
            return Number(item) != Number(topProduct);
        });
        
        topProducts.push(topProduct);
    }
    
    const selectedProducts = await prisma.product.findMany({
        where:{
            id:{
                in:topProducts
            }
        },
        include:{
            restaurant:true
        }
    });
    if(!selectedProducts){
        return res.status(422).json({message:'محصولی برای نمایش نیست!'});
    }

    return res.status(200).json(selectedProducts);
}

export async function changeProductIsActive(req:IGetAuthRequest,res:Response) {
    const {productId} = req.body;

    const product = await prisma.product.findUnique({where:{id:+productId}});
    if(!product){
        return res.status(422).json({message:'محصول انتخابی شما یافت نشد!'});
    }

    const isActive = product.isActive ? false : true;

    const changeProductIsActive = await prisma.product.update({where:{id:product.id},data:{isActive}});
    if(!changeProductIsActive){
        return res.status(422).json({message:'خطا! مشکلی رخ داد!'});
    }
    
    const message:string = isActive ? `${product.title} این کالا موجود شد.` : `${product.title} این کالا ناموجود شد!`;
    return res.status(203).json({message,product:changeProductIsActive});
}
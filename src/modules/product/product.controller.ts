import { Owner,PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express,{Request,Response,Express,NextFunction} from 'express';
import { IGetAuthRequest } from 'src/utils/types/req';


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
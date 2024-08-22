import { Owner,Restaurant, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {Request,Response} from 'express';
import {IGetAuthRequest} from '../../utils/types/req';


export async function newCategory(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;
    console.log(ownerId);
    
    const {
        href,
        title,
    } = req.body;

    const ownerRestaurant:Restaurant = await prisma.restaurant.findFirst({where:{ownerId:ownerId}});
    console.log(ownerRestaurant);
    
    const category = await prisma.category.create(
        {
            data:{
                title,
                href,
                restaurant:{
                    connect:{
                        id:ownerRestaurant.id,
                    }
                }
        }
    });
    if(!category){
        res.status(422).json({message:'ساخت دسته بندی شما با خطا مواجه شد!'});
    }

    res.status(201).json(category);
};

export async function deleteCategory(req:IGetAuthRequest,res:Response) {
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;

    const {id} = req.query;
    
    try{
        const removeCategory = await prisma.category.delete({
            where:{
                id:+id,
            }
        });
        if(!removeCategory){
            return res.status(422).json({message:'حذف دسته بندی شما با خطا مواجه شد!'});
        }
        return res
            .status(422)
            .json({message:'دسته بندی انتخابی شما با موفقیت حذف گردید!',deleted:removeCategory});
    }catch(e){
        return res.status(422).json({message:'دسته بندی مورد نظر قبلا حذف شده است'});
    }   
    
};

export async function selfCategory(req:IGetAuthRequest,res:Response){
    const ownerId = req.ownerId;
    const owner:Owner = req.owner;

    try{
        const ownerRestaurant = await prisma.restaurant.findFirst({
            where:{ownerId}
        });
        if(!ownerRestaurant){
            return res
                .status(422)
                .json({message:'شما هنوز رستورانی را بنام خود ثبت نکرده اید!'});
        }
        
        const ownerCreatedCategory = await prisma.category.findMany({
            where:{restaurantId:ownerRestaurant.id}
        });
        if(ownerCreatedCategory.length === 0){
            return res
                .status(422)
                .json({message:'شما هنوز دسته بندی را ایجاد نکرده اید!'});
        }

        return res
            .status(200)
            .json(ownerCreatedCategory);

    }catch(e){
        return res
            .status(422)
            .json({message:'مشکلی بودجود امده است!',error:e});
    }
    
};


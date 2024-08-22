import {Express,Request, Response} from 'express';
import {IGetUploadRequest} from '../../utils/types/req';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export async function changeLogo(req:IGetUploadRequest,res:Response){
    const owner = req.owner;
    const ownerId = req.ownerId;
    

    const restaurant = await prisma.restaurant.findUnique({where:{ownerId:+ownerId}});
    if(!restaurant){
        return res.status(422).json({message:'رستورانی یافت نشد!'});
    }

    let location = "";
    const file = req.file as Express.MulterS3.File; // Explicitly cast the type
    if (file.location) {
      location = file.location;
    }else{
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }

    const rest = await prisma.restaurant.update({where:{id:restaurant.id},data:{logo:location}});
    if(!rest){
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }

    return res.status(422).json({rest});
}

export async function changeBanner(req:IGetUploadRequest,res:Response){
    const owner = req.owner;
    const ownerId = req.ownerId;
    
  
    const restaurant = await prisma.restaurant.findUnique({where:{ownerId:+ownerId}});
    if(!restaurant){
        return res.status(422).json({message:'رستورانی یافت نشد!'});
    }
  
    let location = "";
    const file = req.file as Express.MulterS3.File; // Explicitly cast the type
    if (file.location) {
      location = file.location;
    }else{
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }
  
    const rest = await prisma.restaurant.update({where:{id:restaurant.id},data:{banner:location}});
    if(!rest){
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }
    
    return res.status(422).json({rest});
}

export async function changeProductImage(req:IGetUploadRequest,res:Response){
    const owner = req.owner;
    const ownerId = req.ownerId;

    const {productId} = req.body;

    const restaurant = await prisma.restaurant.findUnique({where:{ownerId:+ownerId}});
    if(!restaurant){
        return res.status(422).json({message:'رستورانی یافت نشد!'});
    }

    let location = "";
    const file = req.file as Express.MulterS3.File; // Explicitly cast the type
    if (file.location) {
      location = file.location;
    }else{
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }

    const prodcut = await prisma.product.update({
      where:{id:+productId},
      data:{picture:location}
    });
    if(!prodcut){
      return res.status(422).json({message:'بارگذاری عکس با خطا مواجه شد!'});
    }

    return res.status(422).json({prodcut});
}

export async function preview(req:Request,res:Response){
    const {url} = req.body;
    res.sendFile(url,(e)=>{
        return res.status(422).json({message:e});
    });
}


import {Response} from 'express';
import {IGetUploadRequest} from '../../utils/types/req';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export async function changeLogo(req:IGetUploadRequest,res:Response){
    //const owner = req.owner;
    //const ownerId = req.ownerId;
    

    // const restaurant = await prisma.restaurant.findUnique({where:{ownerId:+ownerId}});
    // if(!restaurant){
    //     return res.status(422).json({message:'رستورانی یافت نشد!'});
    // }

    res.status(422).json({...req.file});
}


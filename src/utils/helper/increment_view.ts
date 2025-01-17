import {PrismaClient,Restaurant} from '@prisma/client';
const prisma = new PrismaClient();

export async function incrementView(id:number){
    return new Promise(async(resolve,reject)=>{
        const rest = await prisma.restaurant.update({
            where:{id:+id},
            data:{watchCount:{increment:1}
        }});
        if(!rest){
            reject(rest);
        }
        resolve(rest);
    });
}
import { Restaurant, PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient();

export function calcScore(rest:Restaurant):number{
    let sumScore:number = 0;
    let scoreLen:number = rest.score.length;
    rest.score.forEach((score:number)=>{
        sumScore += score;
    });

    let avgScore:number = Number((sumScore / scoreLen).toFixed(1));
    return avgScore;
}

export function calcMultipleScore(rest:Restaurant[]){
    let resault = [];
    rest.forEach((restaurant:Restaurant)=>{
        let sumScore:number = 0;
        let scoreLen = restaurant.score.length; 
        restaurant.score.forEach((score:number)=>{
            sumScore += score;
        });

        let avgScore:number = Number((sumScore / scoreLen).toFixed(1));
        resault.push({...restaurant,score:avgScore});
    });

    return resault;
}
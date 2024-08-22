import { Restaurant, PrismaClient } from '@prisma/client';
import { number } from 'joi';
//const prisma = new PrismaClient();

export function calcScore(rest:Restaurant){
    let sumScore:number = 0;
    let scoreLen:number = rest.score.length;
    rest.score.forEach((score:number)=>{
        sumScore += score;
    });
    
    let avgScore:number = Number((sumScore / scoreLen).toFixed(1));
    return {...rest,avgScore,sumScore};
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
        resault.push({...restaurant,avgScore});
    });

    return resault;
}

export function calcTotalScoreSingleRest(rest:Restaurant){
    let sumScore:number = 0;
    let scoreLen:number = rest.score.length;
    rest.score.forEach((score:number)=>{
        sumScore += score;
    });

    return sumScore;
}

export function calcTotalScoreMultipleRest(rest:Restaurant[]){
    let resault = [];
    rest.forEach((restaurant:Restaurant)=>{
        let sumScore:number = 0;
        let scoreLen = restaurant.score.length; 
        restaurant.score.forEach((score:number)=>{
            sumScore += score;
        });

        let totalScore:number = Number((sumScore));
        let avgScore:number = Number((sumScore / scoreLen).toFixed(1));
        resault.push({...restaurant,totalScore,avgScore});
    });
    
    return resault;
}
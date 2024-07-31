import express,{Request,Response,NextFunction} from 'express';
import {validationResult} from 'express-validator';

export async function validate(req:Request,res:Response,next:NextFunction) {
    const result = validationResult(req.body);
    if(!result.isEmpty()){
        return res.status(404).json({errors:result.array()});
    }
    next();
};
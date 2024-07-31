import express,{Express,Request,Response,NextFunction } from "express";

export interface IGetAuthRequest extends Request{
    user?:any,
    userId?:number,
    owner?:any,
    ownerId?:number,
}
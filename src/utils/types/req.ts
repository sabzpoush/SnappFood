import express,{Express,Request,Response,NextFunction } from "express";
import {User,Owner} from '@prisma/client';

export interface IGetAuthRequest extends Request{
    user?:User;
    userId?:number;
    owner?:Owner;
    ownerId?:number;
    email:string;
}

export interface IGetUploadRequest extends IGetAuthRequest{
    location: string;
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

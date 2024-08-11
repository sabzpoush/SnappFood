import express,{Express,Request,Response,NextFunction } from "express";

export interface IGetAuthRequest extends Request{
    user?:any,
    userId?:number,
    owner?:any,
    ownerId?:number,
}

export interface IGetUploadRequest extends IGetAuthRequest,Request{
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
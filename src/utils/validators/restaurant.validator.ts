import {body,param,query} from 'express-validator';

export function create(){
    return [
        body('title')
            .notEmpty()
            .withMessage(''),
    ]
}

export function giveScore(){
    return [
        body('restId')
            .notEmpty()
            .withMessage('آیدی رستوران مورد نظر وارد نشده!')
            .toInt(),
        body('score')
            .notEmpty()
            .withMessage('امتیاز را وارد کنید!')
            .toFloat(),
    ]
}


export function changeDeliveryPrice(){
    return [
        body('price')
            .notEmpty()
            .withMessage('قیمت جدید را وارد نمایید')
            .isInt()
            .withMessage('لطفا فقط عدد وارد کنید!')
            .toInt()
    ]
}
import {body,query,param} from 'express-validator';

export function restId(){
    return [
        query('id')
            .notEmpty()
            .withMessage('لطفا ایدی رستوران مورد نظر را وارد کنید!')
    ];
}
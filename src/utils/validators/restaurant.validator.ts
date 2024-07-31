import {body,param,query} from 'express-validator';

export function create(){
    return [
        body('title')
            .notEmpty()
            .withMessage(''),
    ]
}


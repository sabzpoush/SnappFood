import {body,param,query} from 'express-validator';


export function register (){
    return [
        body('email')
            .notEmpty()
            .withMessage('ایمیل نمی تواند خالی باشد!')
            .isEmail()
            .withMessage('ایمیل وارد شده معتبر نیست!'),
        body('password')
            .notEmpty()
            .withMessage('رمز عبور نمی تواند خالی باشد!'),
        body('phone')
            .notEmpty()
            .withMessage('شماره موبایل نمی تواند خالی باشد!'),
        body('fullName')
            .notEmpty()
            .withMessage('نام و نام خانوادگی نمی تواند خالی باشد!'),
    ];
}

export function singIn (){
    return [
        body('ownerIdentifier')
            .notEmpty()
            .withMessage('ایمیل یا شماره موبایل نمی تواند خالی باشد!'),
        body('password')
            .notEmpty()
            .withMessage('رمز عبور نمی تواند خالی باشد!'),
    ]
}


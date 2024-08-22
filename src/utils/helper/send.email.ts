import nodemailer from 'nodemailer';
import {makeCode} from '../../utils/helper/codeMaker';
import {email2FATemplate, showTemplate} from './template';

export async function sendEmail(email:string,subject:string,body:string){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"amirsabz84@gmail.com",
            pass:"hnvo ffgx jqls vvfp"
        }
    });
    
    const messageOption = {
        from:"amirsabz84@gmail.com",
        to:email,
        subject,
        text:body,
    };

    await transporter.sendMail(messageOption,(err,info)=>{
        if(err){
            throw err;
        }
        console.log("email send");
    });

}


export async function sendCode(email:string){
    return new Promise(async (reslove,reject)=>{
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"amirsabz84@gmail.com",
                pass:"hnvo ffgx jqls vvfp"
            }
        });
    
        const code = makeCode(6);
        const tempelate = email2FATemplate(code)
        const messageOption = {
            from:"amirsabz84@gmail.com",
            to:email,
            subject:'Your 2FA Code',
            html:tempelate,
            
        };
    
        await transporter.sendMail(messageOption,(err,info)=>{
            if(err){
                reject(err);
            }
            console.log("email send");
        });
        reslove(code);
    });
}

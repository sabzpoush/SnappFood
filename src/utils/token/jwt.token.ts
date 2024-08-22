import jwt,{Secret,JwtPayload} from 'jsonwebtoken';
import { I_EMAIL, I_Token } from '../types/token';
import process from 'process';


export function refreshToken(id:I_Token):string{
    const secretKey:Secret = process.env.REFRESHTOKEN;
    const token:string = jwt.sign(id,secretKey,
        {
            expiresIn:'10 D'
        }
    );
    return token;
}

export function emailToken(payload:I_EMAIL):string{
    const secretKey:Secret = process.env.EMAIL_TOKEN;
    const token:string = jwt.sign(payload,secretKey,
        {
            expiresIn:'5 m'
        }
    );
    return token;
}
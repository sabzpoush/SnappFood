import jwt,{Secret,JwtPayload} from 'jsonwebtoken';
import {I_Token} from '../types/token';
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
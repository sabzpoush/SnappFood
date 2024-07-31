export function makeCode(length:number):string{
    let numbers = [];

    for(let i=0;i<length;i++){
        const number = Math.floor((Math.random()* 10));
        numbers.push(number);
    }

    let code:string = numbers.join('');
    return code;
}
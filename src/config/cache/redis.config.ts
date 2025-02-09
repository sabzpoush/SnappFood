import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://capital-grouper-12904.upstash.io',
  token: '********',
})

export async function getCacheData(key){
    const data:string = await redis.get(key) as string;
    const jsonData = JSON.parse(data);
    return jsonData;
};

export async function setCacheData(key,value){
    const jsonValue = JSON.stringify(value);
    const data = await redis.set(key,jsonValue);
};

export async function setLimtedTimeCacheData(key,value,ex){
    const jsonValue = JSON.stringify(value);
    const data = await redis.set(key,jsonValue,{ex});
};
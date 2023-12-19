import type { Request } from 'express';
import { allAlphanumericCharacters  } from './constants';
import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 60, checkperiod: 60 });

export function getClientIp(req: Request) {
    return req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
}

export function getClientInfo(req: Request) {
    const clientInfo = req.headers['x-client-info'] as string
    const [name, version] = clientInfo.split("/")
    return { name, version }
}

export function generateShortSlug(length: number = 5) {
    let slug = "";
    for (let i = 0; i < length; i++) {
        slug += allAlphanumericCharacters.charAt(Math.floor(Math.random() * allAlphanumericCharacters.length));
    }
    return slug;
}

export const generateApiKey = () => {
    //create a base-36 string that contains 30 chars in a-z,0-9
    return [...Array(30)]
        .map((e) => ((Math.random() * 36) | 0).toString(36))
        .join('');
};

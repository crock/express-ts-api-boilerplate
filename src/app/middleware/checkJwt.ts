import { Request, Response, NextFunction } from 'express';
import { prisma, config, approvedDomains, getClientInfo } from '../../utils/'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    const { name, version } = getClientInfo(req)

    if (!token) {
        res.status(401).send('Unauthorized')
    }
    
    const decoded = jsonwebtoken.verify(token, config.JWT_SECRET) as JwtPayload

    let user = await prisma.user.findUnique({
        where: {
            id: parseInt(decoded.sub)
        }
    })

    if (!user) {
        res.status(401).send('Unauthorized')
    }

    if (name && decoded.aud !== name || !approvedDomains.includes(name)) {
        res.status(401).send('Unauthorized')
    }

    const { email, username, id, role, discordUserId, createdAt, updatedAt } = user

    req.user = {
        id,
        discordUserId,
        email, 
        username,
        role, 
        createdAt, 
        updatedAt
    }
    next()
}

export default checkJwt
import { Request, Response, NextFunction } from 'express';
import { prisma, approvedDomains, getClientInfo } from '../../utils/'

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKeyHeader = req.headers["x-api-key"]
    const apiKey = apiKeyHeader ? apiKeyHeader.toString() : null
    const { name, version } = getClientInfo(req)

    if (!apiKey) {
        res.status(401).send('No API key provided')
    }
    
    const user = await prisma.user.findUnique({
        where: {
            apiKey
        }
    })

    if (!user) {
        res.status(401).send('Invalid api key')
    }

    if (name && !approvedDomains.includes(name)) {
        res.status(401).send('Unauthorized client')
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

export default checkApiKey
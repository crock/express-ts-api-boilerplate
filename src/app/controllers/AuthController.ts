import type { Request, Response } from 'express';
import { generateShortSlug, config, prisma, approvedDomains, getClientInfo } from '../../utils/';
import bcrypt from 'bcrypt'
import moment from 'moment'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'

class AuthController {
    
    public async fetchProfile(req: Request, res: Response) {
        
        let user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })
        
        if (!user) {
            return res.status(400).send('User not found')
        }
        
        delete user.password
        
        return res.status(200).json(user)
    }

    public async login(req: Request, res: Response) {

        const { username, email, password } = req.body

        let user = await prisma.user.findUnique({
            where: {
                email,
                username
            }
        })

        if (!user) {
            return res.status(400).send('User not found')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(400).send('Incorrect password')
        }

        delete user.password

        const exp = moment().add(1, 'week').unix()

        const { name, version } = getClientInfo(req)
 
        if (!approvedDomains.includes(name)) {
            return res.status(401).send('Client not approved')
        }
        
        const payload = {
            sub: user.id,
            exp,
            aud: name,
        }

        const token = jsonwebtoken.sign(payload, config.JWT_SECRET)

        return res.status(200).send(token)
    }

    // check if user is logged in
    public async check(req: Request, res: Response) {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).send('Unauthorized')
        }

        const decoded = jsonwebtoken.verify(token, config.JWT_SECRET) as JwtPayload

        let user = await prisma.user.findUnique({
            where: {
                id: parseInt(decoded.sub.toString())
            }
        })

        if (!user) {
            return res.status(401).send('Unauthorized')
        }

        const { exp, aud } = decoded as JwtPayload

        if (!exp) {
            return res.status(401).send('Unauthorized')
        }

        const { name, version } = getClientInfo(req)

        const expired = moment().isAfter(moment.unix(exp))

        return res.status(200).json({
            loggedIn: !expired,
            clientInfo: {
                name,
                version
            }
        })
    }

    public async register(req: Request, res: Response) {
        const { username, email, password, confirmPassword, confirmEmail, ipAddress } = req.body

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match')
        }

        if (email !== confirmEmail) {
            return res.status(400).send('Emails do not match')
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const generatedUsername = email.split('@')[0] + generateShortSlug(5)

        let user = await prisma.user.create({
            data: {
                email,
                username: username || generatedUsername,
                password: encryptedPassword,
                ipAddress
            }
        })

        delete user.password

        return res.status(200).json(user)
    }
}

export default AuthController;
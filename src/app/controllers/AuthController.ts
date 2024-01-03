import type { NextFunction, Request, Response } from 'express';
import { generateShortSlug, prisma } from '../../utils/';
import moment from 'moment'
import { DiscordService } from '../services/social'

class AuthController {

    public async viewDashboard(req: Request, res: Response) {

        const user = await prisma.user.findUnique({
            where: {
                id: req.session.user
            }
        })

        const { apiKey } = user

        res.render('dashboard', { title: 'Dashboard', hasApiKey: !!apiKey, apiKey })
    }
    
    public async fetchProfile(req: Request, res: Response) {
        
        let user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })
        
        if (!user) {
            return res.status(400).send('User not found')
        }
        
        const { email, username, id, discordUserId, role, createdAt, updatedAt } = user
        
        return res.status(200).json({
            id,
            discordUserId,
            email, 
            username,
            role, 
            createdAt, 
            updatedAt
        })
    }

    public login(req: Request, res: Response) {

        const ds = new DiscordService()
        
        res.redirect(ds.getAuthorizationUrl())
    }

    public async callback(req: Request, res: Response, next: NextFunction) {
            
            const { code } = req.query
            
            if (!code) {
                return res.status(400).send('Missing code parameter')
            }

            const ds = new DiscordService()
            
            const tokenResponse = await ds.getAccessToken(code.toString())
            
            const userInfoResponse = await ds.getUserInfo(tokenResponse.access_token)
            
            if (!userInfoResponse.email) {
                return res.status(400).send('Missing email')
            }
            
            let user = await prisma.user.findUnique({
                where: {
                    email: userInfoResponse.email
                }
            })

            const updateData = {
                ipAddress: req.ip,
                discordUserId: userInfoResponse.id,
                discordAccessToken: tokenResponse.access_token,
                discordRefreshToken: tokenResponse.refresh_token,
                discordTokenExpiresAt: moment().add(tokenResponse.expires_in, 'seconds').toDate()
            }
            
            if (!user) {
                user = await prisma.user.upsert({
                    where: {
                        email: userInfoResponse.email
                    },
                    create: {
                        email: userInfoResponse.email,
                        ...updateData
                    },
                    update: updateData
                })
            }

            req.user = user
            
            req.session.regenerate(function (err) {
                if (err) next(err)

                req.session.user = user.id

                req.session.save(function (err) {
                    if (err) next(err)

                    res.redirect('/dashboard')
                })
            })
    }

    public logout(req: Request, res: Response, next: NextFunction) {

        req.user = null
        req.session.user = null

        req.session.save(function (err) {
            if (err) next(err)
            
            req.session.regenerate(function (err) {
                if (err) next(err)

                res.redirect('/')
            })
        })
    }

    public async requestApiAccess(req: Request, res: Response) {
        
        const apiKey = generateShortSlug(15)
        
        await prisma.user.update({
            where: {
                id: req.session.user
            },
            data: {
                apiKey
            }
        })

        res.redirect('/dashboard')
    }

    public async revokeApiAccess(req: Request, res: Response) {
        
        await prisma.user.update({
            where: {
                id: req.session.user
            },
            data: {
                apiKey: null
            }
        })

        res.redirect('/dashboard')
    }
}

export default AuthController;
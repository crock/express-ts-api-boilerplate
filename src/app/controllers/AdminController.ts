import type { Request, Response } from 'express';
import { config, prisma, reservedUsernames } from '../../utils/';
import { Role } from '@prisma/client';

class AdminController {

    public async changeRole(req: Request, res: Response) {
            const user = req.user

            if (user.role !== Role.ADMIN && user.role !== Role.STAFF) {
                return res.status(401).json({
                    error: "Unauthorized"
                })
            }
            
            const { userId } = req.params
            const { role } = req.body

            if (!(role in Role)) {
                return res.status(400).json({
                    error: "Invalid role"
                })
            }
    
            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                    role
                }
            })

            const { email, username, id, discordUserId, createdAt, updatedAt } = updatedUser
        
            return res.status(200).json({
                user: {
                    id,
                    discordUserId,
                    email, 
                    username,
                    role, 
                    createdAt, 
                    updatedAt
                },
                updated: true
            })
    }

    public async forceChangeUsername(req: Request, res: Response) {
        const user = req.user

        if (user.role !== Role.ADMIN && user.role !== Role.STAFF) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        
        const { userId } = req.params
        const { username } = req.body

        // if (reservedUsernames.includes(username)) {
        //     return res.status(400).json({
        //         error: "Username is reserved"
        //     })
        // }

        const existingUser = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (existingUser) {
            return res.status(400).json({
                error: "Username is taken"
            })
        }

        let updatedUser = await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: {
                username
            }
        })

        const { email, id, role, discordUserId, createdAt, updatedAt } = updatedUser
        
        return res.status(200).json({
            user: {
                id,
                discordUserId,
                email, 
                username,
                role, 
                createdAt, 
                updatedAt
            },
            updated: true
        })
    }
}

export default AdminController
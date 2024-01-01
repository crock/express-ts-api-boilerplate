import { User } from '@prisma/client'
import { Session } from 'express-session'

declare global {
    namespace Express {
        interface Request {
            user: Partial<User>
            session: Session
        }

        interface Application {
            start: (port: number) => any
        }
    }
}


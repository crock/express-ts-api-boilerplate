import { User } from '@prisma/client'

declare global {
    namespace Express {
        interface Request {
            user: Partial<User>
        }

        interface Application {
            start: (port: number) => any
        }
    }
}


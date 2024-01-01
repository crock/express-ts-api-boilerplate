import { Request, Response, NextFunction } from 'express';

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) next()
    else next('route')
}

export default isAuthenticated

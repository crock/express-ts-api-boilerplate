import v1 from './v1/'
import { Router } from 'express';

interface IRoutes {
    [key: string]: {
        [key: string]: Router
    }
}

const routes: IRoutes = {
    v1
}

export default routes
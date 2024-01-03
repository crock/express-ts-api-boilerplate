import { Router } from 'express'
import versions from './api'
import views from './views'

interface IRoutes {
    api: {
        [key: string]: {
            [key: string]: Router
        }
    },
    views: {
        [key: string]: Router
    }
}

const routes: IRoutes = {
    api: {...versions},
    views: {...views}
}

export default routes
/// <reference path="./types/overrides.d.ts" />
import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import routes from './routes'
import { config, appName } from './utils/'
import cors from 'cors'
import { toInteger } from 'lodash'
import fs from 'fs'
import pino from 'pino'
import pinoHttp from 'pino-http'
import path from 'path'
import { createServer } from 'http'
import hbs from 'hbs'
import { v4 as uuid } from 'uuid'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'

const port = toInteger(config.PORT)

// Create the express app
const app = express()
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

const server = createServer(app)
const io = new Server(server)

// Create redis store
const redisClient = createClient()
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
    client: redisClient,
    prefix: `${appName}:`
})

// Create the logger instance
const logger = pino()

// Common middleware
// app.use('/docs', express.static(path.join(__dirname, '..', 'docs')))
app.use(pinoHttp({ logger }))
app.use(express.json())
app.use(cors({
  origin: '*',
}))

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 604800000), // 1 week
        secure: false,
        httpOnly: true,
    },
    genId: function (req: Request) {
        return uuid()
    },
    secret: config.SESSION_SECRET,
    name: appName
}))

app.get('/', (req: Request, res: Response) => { 
    res.render('index', { title: 'Hey', message: 'Hello there!', loggedIn: req.session.user })
});
    
// Register routes
const apiRouteVersions = Object.keys(routes.api)

// sort routes by version, starting with the newest
const versionsSorted = apiRouteVersions.sort((a, b) => {
    if (a === 'v1') {
        return 1
    }
    if (b === 'v1') {
        return -1
    }

    return 0
})

apiRouteVersions.forEach(version => {
    const routeSections = Object.keys(routes.api[version])
    routeSections.forEach(section => {
        if (version === versionsSorted[0]) {
            app.use(`/${section}`, routes.api[version][section])
        }
        app.use(`/${version}/${section}`, routes.api[version][section])
    })
})

for (const view in routes.views) {
    app.use('/', routes.views[view])
}

// Register custom events
fs.readdirSync(`${__dirname}/events`).forEach((file) => {
    const event = require(`${__dirname}/events/${file}`)
    console.info(`Registering event: ${event.info.name}`)
    io.on(event.info.name, event.handler)
})

app.start = app.listen = function(p) {
    console.log(`Server started on port ${p}`)
    return server.listen.apply(server, arguments)
}

const start = async () => {
    app.start(port)
};

start()
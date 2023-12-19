/// <reference path="./types/overrides.d.ts" />
import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import routes from './routes'
import { config } from './utils/'
import cors from 'cors'
import { toInteger } from 'lodash'
import fs from 'fs'
import pino from 'pino'
import pinoHttp from 'pino-http'
import path from 'path'
import { createServer } from 'http'

const port = toInteger(config.PORT)

// Create the express app
const app = express()

const server = createServer(app)
const io = new Server(server)

// Create the logger instance
const logger = pino()

// Common middleware
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')))
app.use(pinoHttp({ logger }))
app.use(express.json())
app.use(cors({
  origin: '*',
}))

app.get('/', (req: Request, res: Response) => { 
    res.send(`Hello World!`)
});
    
// Register routes
const routeVersions = Object.keys(routes)

routeVersions.forEach(version => {
    const routeSections = Object.keys(routes[version])
    routeSections.forEach(section => {
        if (version === 'v1') {
            app.use(`/${section}`, routes[version][section])
        }
        app.use(`/${version}/${section}`, routes[version][section])
    })
})

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
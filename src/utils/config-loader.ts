import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const dotEnvFileName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'

const configPath = path.join(process.cwd(), dotEnvFileName)

if (!fs.existsSync(configPath)) {
    throw new Error(`Environment variables not found at ${configPath}. Please duplicate .env.example and rename it to .env`)
}

const result = dotenv.config({
    path: configPath
})

if (result.error) {
    throw new Error(`Error loading .env config file at ${configPath}: ${result.error}`)
}

export const config = result.parsed

if (process.env.NODE_ENV === 'development' || process.env.APP_ENV === 'local' && process.env.DEBUG === 'true') {
    console.log(config)
}




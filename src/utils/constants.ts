import path from 'path'
import { config } from './config-loader'
import slugify from 'slugify'

export const primaryDomain = config.APP_DOMAIN

export const appName = slugify(config.APP_NAME, {
    lower: true,
    strict: true,
    replacement: '-'

})

export const appUrl = process.env.NODE_ENV === "development" 
    ? 'http://localhost:3000'
    : `https://${primaryDomain}`

export const storagePath = path.join(__dirname, '..', '..', 'storage')

export const lowercaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
export const uppercaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const numericAlphabet = "0123456789";

export const allAlphanumericCharacters = lowercaseAlphabet + uppercaseAlphabet + numericAlphabet;

export const reservedUsernames = [
    "admin",
    "administrator",
    "root",
    "user",
    "username",
    "bot",
    "robot",
    "system",
    "test",
    "testing",
    "tester",
    "testuser",
    "mod",
    "moderator",
    "staff",
    "support",
    "contact",
    "info",
    "help",
]

export const approvedDomains = []
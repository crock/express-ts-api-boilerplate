import path from 'path'

export const storagePath = path.join(process.cwd(), 'storage')

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
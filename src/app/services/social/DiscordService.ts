import SocialLogin from "./SocialLogin";
import { config, appUrl } from "../../../utils";
import axios from 'axios'
import type { DiscordAccessTokenResponse, DiscordUserInfoResponse } from '../../../types/social'

class DiscordService implements SocialLogin {
    displayName: string = 'Discord'
    slug: string = 'discord'

    async getUserInfo(token: string): Promise<DiscordUserInfoResponse> {

        if (!token) {
            throw new Error('No access token provided')
        }
        
        const response = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status !== 200) {
            throw new Error('Failed to get user info')
        }

        return response.data
    }

    getAuthorizationUrl(): string {
        const clientIdEnvVar = `${this.slug.toUpperCase()}_CLIENT_ID`

        if (!config[clientIdEnvVar]) {
            throw new Error(`Missing ${clientIdEnvVar} environment variable`)
        }

        const data = {
            client_id: config[clientIdEnvVar],
            redirect_uri: `${appUrl}/auth/callback`,
            response_type: 'code',
            scope: 'identify email'
        }

        const params = new URLSearchParams(data).toString()
        const url = new URL(`https://discord.com/api/oauth2/authorize?${params}`).toString()
        
        return url
    }

    async getAccessToken(code: string): Promise<DiscordAccessTokenResponse> {
        
        const clientIdEnvVar = `${this.slug.toUpperCase()}_CLIENT_ID`
        const clientSecretEnvVar = `${this.slug.toUpperCase()}_CLIENT_SECRET`

        if (!config[clientIdEnvVar]) {
            throw new Error(`Missing ${clientIdEnvVar} environment variable`)
        }

        if (!config[clientSecretEnvVar]) {
            throw new Error(`Missing ${clientSecretEnvVar} environment variable`)
        }

        const data = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${appUrl}/auth/callback`,
        }

        const params = new URLSearchParams(data).toString()

        const url = new URL('https://discord.com/api/oauth2/token').toString()

        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: config[clientIdEnvVar],
                password: config[clientSecretEnvVar]
            }
        })

        if (response.status !== 200) {
            throw new Error('Failed to get access token')
        }

        return response.data
    }
}

export default DiscordService;
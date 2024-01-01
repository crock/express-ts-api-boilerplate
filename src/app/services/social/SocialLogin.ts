
abstract class SocialLogin {
    displayName: string;
    slug: string;
    abstract getUserInfo(token: string): Promise<any>;
    abstract getAuthorizationUrl(): string;
    abstract getAccessToken(code: string): Promise<any>;
}

export default SocialLogin;
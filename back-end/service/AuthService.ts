import * as googleapis from 'googleapis';
import * as jwt from 'jwt-simple';
import axios from 'axios';
import { config } from '../utils/jwt-config';
import { addUser, findUser, updateUser } from '../utils/user';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { Model, Status, Express } from '../module';
import { GOOGLE } from '../constants/GOOGLE_RESPONSE';
import { AUTH } from '../constants/AUTH';
const { google } = googleapis;
const OAuth2Client = google.auth.OAuth2;
const verifyLink = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=';

export class AuthService {
    constructor(private googleAuthObject: Model.IGoogleAuthObject) {
        this.googleAuthObject = googleAuthObject;
    }

    private getAccessToken(code: string): Promise<Credentials> {
        const { clientId, clientSecret, redirectUri } = this.googleAuthObject;
        const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
        return oAuth2Client.getToken(code)
            .then(response => response.tokens)
            .catch(err => {
                console.log(err);
                throw new Error(GOOGLE.GET_ACCESS_TOKEN_FAIL);
            });
    }

    // Get google id 
    private getUserInfo(accessToken: string): Promise<Status.IGoogleVerifyResponse> {
        return axios.get(`${verifyLink}${accessToken}`)
            .then(response => response.data)
            .catch(err => {
                console.log(err);
                throw new Error(GOOGLE.GET_USER_ID_FAIL);
            });
    }

    // Refresh google access token if expired
    private refreshAccessToken(credenials: Model.IGoogleCredentials): Promise<Credentials> {
        const { clientId, clientSecret, redirectUri } = this.googleAuthObject;
        const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
        oAuth2Client.setCredentials(credenials);
        return oAuth2Client.refreshAccessToken()
            .then(response => response.credentials)
            .catch(err => {
                throw new Error(GOOGLE.REFRESH_ACCESS_TOKEN_FAIL);
            });
    }

    private addUser(user: Model.IUserInfo) {
        return addUser(user);
    }

    private findUser(userId: string) {
        return findUser(userId);
    }

    private updateUser(user: Model.IUserInfo) {
        return updateUser(user);
    }

    public async googleLogin(req: Express.reqBody<{ code: string }>): Promise<Status.ILoginSuccess> {
        try {
            const { code } = req.body;

            // Exchange access token with google using authorization code
            const tokens = await this.getAccessToken(code);

            if (!tokens || !tokens.access_token || !tokens.expiry_date || !tokens.refresh_token) {
                throw new Error(GOOGLE.GET_ACCESS_TOKEN_FAIL);
            }

            const { access_token, expiry_date, refresh_token } = tokens;

            // Get the google id of the user with the v1 verification link
            // Add user to json database if id not found, else update the userInfo.
            const user = await this.getUserInfo(access_token);

            if (!user || !user.id) {
                throw new Error(GOOGLE.GET_USER_ID_FAIL);
            }

            const userinfo: Model.IUserInfo = {
                id: user.id,
                name: user.name,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiry: expiry_date
            };

            if (!await this.findUser(user.id)) {
                await this.addUser(userinfo);
            } else {
                await this.updateUser(userinfo);
            }

            // return with jwt token
            const payload = {
                expiry: expiry_date,
                id: user.id,
                name: user.name
            }

            return {
                status: AUTH.LOGIN_SUCCESS,
                token: jwt.encode(payload, config.privateKey, config.jwtAlgorithm)
            }

        } catch (err) {
            switch (err.message) {
                case GOOGLE.GET_USER_ID_FAIL:
                case GOOGLE.GET_ACCESS_TOKEN_FAIL:
                case GOOGLE.REFRESH_ACCESS_TOKEN_FAIL:
                    throw new Error(err.message);
                default: {
                    console.log(err);
                    throw new Error(AUTH.LOGIN_FAIL);
                }
            }
        }
    }

    public async jwtLogin(req: Express.reqHeaders<{ authorization: string }>): Promise<Status.ILoginSuccess> {
        try {
            const jwtToken = req.headers.authorization.replace('Bearer ', '');
            const payload: Model.IUserPayload = jwt.decode(jwtToken, config.publicKey, false, config.jwtAlgorithm);

            // Find user inside json fake database with the google id
            const user = await this.findUser(payload.id);
            let newToken: undefined | string;

            if (!user) {
                throw new Error(AUTH.NO_USER);
            }

            if (payload.expiry < user.expiry) {
                throw new Error(AUTH.INVALID_JWT);
            }

            if (payload.expiry <= Date.now() / 1000 && payload.expiry === user.expiry) {
                // Check if the expiry in json database and payload are the same, preventing reuse of previous jwt token
                // Refresh the access token and jwt token if expired
                const newTokens = await this.refreshAccessToken({
                    access_token: user.accessToken,
                    refresh_token: user.refreshToken,
                    expiry_date: user.expiry
                });

                if (!newTokens || !newTokens.access_token || !newTokens.expiry_date) {
                    throw new Error(GOOGLE.REFRESH_ACCESS_TOKEN_FAIL);
                }


                // Update the user info in database for new expiry and access token
                await this.updateUser({
                    id: user.id,
                    name: user.name,
                    expiry: newTokens.expiry_date,
                    accessToken: newTokens.access_token,
                    refreshToken: user.refreshToken
                });

                const newPayload = {
                    name: user.name,
                    expiry: newTokens.expiry_date,
                    id: user.id
                }

                newToken = jwt.encode(newPayload, config.privateKey, config.jwtAlgorithm)
            }

            // New token will be delivered with the response if jwt are valid but expired.
            return {
                status: AUTH.LOGIN_SUCCESS,
                token: newToken
            }
        } catch (err) {
            switch (err.message) {
                case AUTH.INVALID_JWT:
                case AUTH.NO_USER:
                case GOOGLE.REFRESH_ACCESS_TOKEN_FAIL:
                    throw new Error(err.message);
                default: {
                    console.log(err);
                    throw new Error(AUTH.LOGIN_FAIL);
                }
            }
        }
    }
}
import { Model } from "../module";
import * as googleapis from 'googleapis';
import * as jwt from 'jwt-simple';
import { promisify } from 'util';
import { config } from '../utils/jwt-config';
import { Express } from '../module';
import { OAuth2Client as IOAuth2Client } from "google-auth-library";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { CALENDAR } from "../constants/CALENDAR";
import { GOOGLE } from "../constants/GOOGLE_RESPONSE";
const { google } = googleapis;
const OAuth2Client = google.auth.OAuth2;

export class CalendarService {
    constructor(private googleAuthObject: Model.IGoogleAuthObject) {
        this.googleAuthObject = googleAuthObject;
    }

    // Separated for mocking in unit test
    private createOAuth2Client(): IOAuth2Client {
        const { clientId, clientSecret, redirectUri } = this.googleAuthObject;
        return new OAuth2Client(clientId, clientSecret, redirectUri);
    }

    // Return google oAuthClient with credentials set, also refresh and return new jwt token if expired
    private async authorize(user: Model.IRequestUserObject): Promise<{ auth: IOAuth2Client, token: string | undefined }> {
        const oAuth2Client = this.createOAuth2Client();

        let { accessToken: access_token, refreshToken: refresh_token, expiry: expiry_date } = user;
        const credentials = { access_token, refresh_token, expiry_date };

        // Check if the access token is expired
        const newCredentials = await this.checkIfExpired(expiry_date, oAuth2Client);
        oAuth2Client.setCredentials(newCredentials || credentials);

        return {
            auth: oAuth2Client,
            // return jwt token with new expiry date if refreshed.
            token: newCredentials ? jwt.encode({ id: user.id, name: user.name, expiry: newCredentials.expiry_date }, config.privateKey, config.jwtAlgorithm)
                : undefined
        }
    }

    private getGoogleEventList(calendar: any, option: Model.EventListQueryObject) {
        return (promisify<any>(calendar.events.list))(option);
    }
    private getGoogleEvent(calendar: any, option: Model.QueryEventObject) {
        return (promisify<any>(calendar.events.get))(option);
    }

    private createGoogleEvent(calendar: any, option: { calendarId: string } & Model.CreateEventObject) {
        return (promisify<any>(calendar.events.insert))(option);
    }

    private removeGoogleEvent(calendar: any, option: Model.QueryEventObject) {
        return (promisify<any>(calendar.events.delete))(option);
    }

    private updateGoogleEvent(calendar: any, option: Model.QueryEventObject & Model.UpdateEventObject) {
        return (promisify<any>(calendar.events.patch))(option);
    }

    // Refresh google access token if expired.
    private refreshAccessToken(oAuth2Client: IOAuth2Client): Promise<Credentials> {
        return oAuth2Client.refreshAccessToken()
            .then(response => response.credentials)
            .catch(err => {
                throw new Error(GOOGLE.REFRESH_ACCESS_TOKEN_FAIL);
            });
    }

    // Check if google access token expired
    private async checkIfExpired(expiry: number, oAuth2Client: IOAuth2Client): Promise<Model.IGoogleCredentials | undefined> {
        if (expiry < Date.now() / 1000) {
            let { access_token, refresh_token, expiry_date } = await this.refreshAccessToken(oAuth2Client);
            if (!access_token || !refresh_token || !expiry_date) {
                throw new Error(GOOGLE.REFRESH_ACCESS_TOKEN_FAIL)
            }
            return { access_token, refresh_token, expiry_date };
        }
        return;
    }

    // Return google calendar event list
    public async listEvent(req: Express.reqQuery<Model.EventListQueryObject> & Express.reqParams<{ calendarId: string }> & Express.reqUser<Model.IRequestUserObject>): Promise<any> {
        const { auth, token } = await this.authorize(req.user);
        const { q, maxResults, orderBy, timeMax, timeMin, pageToken, updateMin } = req.query;
        const { calendarId } = req.params;
        const calendar = google.calendar({ version: 'v3', auth });

        return this.getGoogleEventList(calendar, {
            calendarId: calendarId || 'primary',
            timeMin: timeMin || (new Date()).toISOString(),
            maxResults: maxResults || 100,
            singleEvents: true,
            orderBy: orderBy || 'startTime',
            timeMax: timeMax,
            updateMin: updateMin,
            pageToken: pageToken,
            q: q
        })
            .then((response: any) => {
                const events = response.data.items.map((item: any) => {
                    const { id, start, end, summary, description, reminders, updated } = item;
                    return { id, start, end, summary, description, reminders, updated };
                })
                return {
                    status: CALENDAR.GET_EVENT_LIST_SUCCESS,
                    token: token,
                    events
                }
            })
            .catch((err: any) => {
                throw new Error(CALENDAR.GET_EVENT_LIST_FAIL);
            })
    }

    public async createEvent(req: Express.reqBody<Model.CreateEventObject> & Express.reqParams<{ calendarId: string }> & Express.reqUser<Model.IRequestUserObject>): Promise<any> {
        const { auth, token } = await this.authorize(req.user);
        const { calendarId } = req.params;
        const calendar = google.calendar({ version: 'v3', auth });

        return this.createGoogleEvent(calendar, { calendarId: calendarId || 'primary', resource: req.body.resource })
            .then((response: any) => {
                return { status: CALENDAR.CREATE_EVENT_SUCCESS, token }
            })
            .catch((err: any) => {
                throw new Error(CALENDAR.CREATE_EVENT_FAIL);
            });
    }

    public async removeEvent(req: Express.reqParams<Model.QueryEventObject> & Express.reqUser<Model.IRequestUserObject>): Promise<any> {
        const { auth, token } = await this.authorize(req.user);
        const { calendarId, eventId } = req.params;
        const calendar = google.calendar({ version: 'v3', auth });

        return this.removeGoogleEvent(calendar, { calendarId, eventId })
            .then(() => ({ status: CALENDAR.REMOVE_EVENT_SUCCESS, token }))
            .catch((err: any) => {
                throw new Error(CALENDAR.REMOVE_EVENT_FAIL)
            });
    }

    public async getEvent(req: Express.reqParams<Model.QueryEventObject> & Express.reqUser<Model.IRequestUserObject>): Promise<any> {
        const { auth, token } = await this.authorize(req.user);
        const { calendarId, eventId } = req.params;
        const calendar = google.calendar({ version: 'v3', auth });
        return this.getGoogleEvent(calendar, { calendarId, eventId })
            .then(({ data }: any) => ({ status: CALENDAR.GET_EVENT_SUCCESS, token, event: data }))
            .catch((err: any) => {
                throw new Error(CALENDAR.GET_EVENT_FAIL)
            })
    }

    public async updateEvent(req: Express.reqBody<Model.UpdateEventObject> & Express.reqParams<Model.QueryEventObject> & Express.reqUser<Model.IRequestUserObject>): Promise<any> {
        const { auth, token } = await this.authorize(req.user);
        const { calendarId, eventId } = req.params;

        const calendar = google.calendar({ version: 'v3', auth });
        return this.updateGoogleEvent(calendar, { calendarId, eventId, resource: req.body.resource })
            .then(() => ({ status: CALENDAR.UPDATE_EVENT_SUCCESS, token }))
            .catch((err: any) => {
                throw new Error(CALENDAR.UPDATE_EVENT_FAIL)
            });
    }
}
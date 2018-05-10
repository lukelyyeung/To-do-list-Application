import { Credentials } from "google-auth-library/build/src/auth/credentials";

export declare module Service {
    interface IAuthService {
        googleLogin: (req: Express.reqBody<{ code: string }>) => Promise<Status.ILoginSuccess>
        jwtLogin: (req: Express.reqHeaders<{ authorization: string }>) => Promise<Status.ILoginSuccess>
    }

    interface ICalendarService {
        listEvent: (req: any) => Promise<any>;
        getEvent: (req: any) => Promise<any>;
        createEvent: (req: any) => Promise<any>;
        removeEvent: (req: any) => Promise<any>;
        updateEvent: (req: any) => Promise<any>;
    }
}

export declare module Model {
    // User info store in faked json database
    interface IUserInfo {
        id: string;
        name?: string;
        accessToken: string;
        refreshToken: string;
        expiry: number;
    }
    // Structure of req.user if passed auth.authenticated
    interface IRequestUserObject {
        id: string;
        name: string;
        accessToken: string;
        refreshToken: string;
        expiry: number;
    }
    // Structure of JWT token payload
    interface IUserPayload {
        id: string;
        name?: string;
        expiry: number;
    }
    // Structure of user credentials for google OauthClient
    interface IGoogleCredentials {
        access_token: string;
        refresh_token: string;
        expiry_date: number;
    }
    // Structure of client credential for google OauthCLient
    interface IGoogleAuthObject {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
    }
    // structure of query object when requesting event list
    interface EventListQueryObject {
        maxResults: number;
        orderBy?: 'startTime' | 'updated';
        timeMax?: Date | string;
        timeMin?: Date | string;
        updateMin?: Date | string;
        q?: string;
        singleEvents?: boolean;
        pageToken?: string;
        calendarId?: string | 'primary'
    }

    interface CreateEventObject {
        resource: {
            summary?: string;
            description?: string;
            start: {
                dateTime?: Date;
                date?: Date;
                timeZone?: string;
            };
            end: {
                dateTime?: Date;
                date?: Date;
                timeZone?: string;
            };
        }
    }

    interface QueryEventObject {
        calendarId: string;
        eventId: string;
    }

    // Structure of event object when updating event
    interface UpdateEventObject {
        resource: {
            [key: string]: string | Date | any[];
        }
    }

}

export declare module Status {
    interface ILoginSuccess {
        status: string;
        token?: string
    }

    interface IGeneralError {
        error: string;
    }

    // Structure of response by google verify link
    interface IGoogleVerifyResponse {
        id?: string;
        email?: string;
        error?: string;
        error_description?: string;
        name?: string;
        picture?: string;
    }
}

export declare namespace Express {
    export interface ICustomRequestUser<T> {
        user: T;
    }

    export interface reqUser<T> {
        user: T;
    }

    export interface reqBody<T> {
        body: T;
    }

    export interface reqHeaders<T> {
        headers: T;
    }

    export interface reqQuery<T> {
        query: T;
    } 

    export interface reqParams<T> {
        params: T;
    } 

}
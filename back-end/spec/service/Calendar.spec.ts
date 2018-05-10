
import "jasmine";
import { CalendarService } from '../../service/CalenderService';
import { Service } from "../../module";
// import { Service, Model } from "../../module";
// import * as jwt from "jwt-simple";
// import { config } from "../../utils/jwt-config";
// const generateJwt = (userPayload: Model.IUserPayload) => jwt.encode(userPayload, config.privateKey, config.jwtAlgorithm);
// const verifyJwt = (token: string | undefined) => jwt.decode(token, config.publicKey);

describe("The Calendar functions should be able to", function () {

    const fakeGoogleCalendarObject = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'redirectUri',
    }

    // Tokens returned by OCalendar2Client.getAccessToken
    const googleTokens = {
        refresh_token: 'refresh_token',
        // expire after 3600s
        expiry_date: (new Date().getTime() + 3600000) / 1000,
        access_token: 'access_token',
        token_type: 'bearer',
        id_token: 'id_token'
    }

    const userObject = {
        id: 'id',
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token,
        expiry: googleTokens.expiry_date
    }

    const expiredUserObject = {
        id: 'id',
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token,
        expiry: 0
    }

    const userCredential = {
        access_token: googleTokens.access_token,
        refresh_token: googleTokens.refresh_token,
        expiry_date: googleTokens.expiry_date
    }

    const eventListQueryObject = {
        maxResult: 10
    }

    const paramsObject = {
        calendarId: 'calendarId',
        eventId: 'eventId'
    };

    const event = {
        id: 'id',
        summary: 'summary',
        description: 'description',
        start: {
            dateTime: '1970-01-01T12:00'
        },
        end: {
            dateTime: '1970-01-01T15:00'
        },
        reminders: {
            userDefault: false
        }
    };

    const eventList = [event];

    let
        authorizeCallThorugh: jasmine.Spy,
        // checkIfExpiredCallThorugh: jasmine.Spy,
        fakeCreateOAuth2Client: jasmine.Spy,
        fakeGetGoogleEventList: jasmine.Spy,
        fakeGetGoogleEvent: jasmine.Spy,
        fakeCreateGoogleEvent: jasmine.Spy,
        fakeGetRefreshToken: jasmine.Spy,
        fakeUpdateGoogleEvent: jasmine.Spy,
        fakeRemoveGoogleEvent: jasmine.Spy,
        fakedOAuth2Client: jasmine.SpyObj<{
            setCredentials: () => void,
            refreshAccessToken: () => Promise<typeof googleTokens>
        }>

    let Calendar: Service.ICalendarService;

    beforeEach(function () {
        fakedOAuth2Client = jasmine.createSpyObj('oAuth2Client', ['setCredentials', 'refreshAccessToken']);
        Calendar = new CalendarService(fakeGoogleCalendarObject);
        // checkIfExpiredCallThorugh = spyOn<any>(Calendar, 'checkIfExpired').and.callThrough();
        authorizeCallThorugh = spyOn<any>(Calendar, 'authorize').and.callThrough();
        fakeCreateOAuth2Client = spyOn<any>(Calendar, 'createOAuth2Client').and.returnValue(fakedOAuth2Client);
        fakeGetGoogleEventList = spyOn<any>(Calendar, 'getGoogleEventList').and.returnValue(new Promise((res) => res({ data: { items: eventList } })));
        fakeGetGoogleEvent = spyOn<any>(Calendar, 'getGoogleEvent').and.returnValue(new Promise((res) => res({ data: event })));
        fakeCreateGoogleEvent = spyOn<any>(Calendar, 'createGoogleEvent').and.returnValue(new Promise((res, rej) => res()))
        fakeUpdateGoogleEvent = spyOn<any>(Calendar, 'updateGoogleEvent').and.returnValue(new Promise((res, rej) => res()))
        fakeRemoveGoogleEvent = spyOn<any>(Calendar, 'removeGoogleEvent').and.returnValue(new Promise((res, rej) => res()))
        fakeGetRefreshToken = spyOn<any>(Calendar, 'refreshAccessToken').and.returnValue(new Promise(res => res(googleTokens)));
    });

    it("get event list from google calendar.", function (done) {
        Calendar.listEvent({ user: userObject, params: paramsObject, query: eventListQueryObject })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(userObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeGetGoogleEventList).toHaveBeenCalled();
                expect(response.status).toBe('Get event list successfully');
                expect(response.events).toEqual(eventList);
                expect(response.token).toBeUndefined();
            })
            .then(() => done());
    });

    it("throw error when cannot get event list.", function (done) {
        fakeGetGoogleEventList.and.returnValue(new Promise((res, rej) => rej(new Error())));
        Calendar.listEvent({ user: userObject, params: paramsObject, query: eventListQueryObject })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Get calendar list failure')))
            .then(() => done());
    });

    it("get event details from google calendar", function (done) {
        Calendar.getEvent({ user: userObject, params: paramsObject })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(userObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeGetGoogleEvent).toHaveBeenCalled();
                expect(response.status).toBe('Get event successfully');
                expect(response.event).toEqual(event);
                expect(response.token).toBeUndefined();
            })
            .then(() => done());
        done();
    });

    it("throw error when cannot get event details.", function (done) {
        fakeGetGoogleEvent.and.returnValue(new Promise((res, rej) => rej(new Error())));
        Calendar.getEvent({ user: userObject, params: paramsObject, query: eventListQueryObject })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Get event failure')))
            .then(() => done());
    });

    it("create event on google calendar", function (done) {
        Calendar.createEvent({ user: userObject, params: paramsObject, body: event })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(userObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeCreateGoogleEvent).toHaveBeenCalled();
                expect(response.status).toBe('Create event successfully');
                expect(response.token).toBeUndefined();
            })
            .then(() => done());
        done();
    });

    it("throw error when cannot create event.", function (done) {
        fakeCreateGoogleEvent.and.returnValue(new Promise((res, rej) => rej(new Error())));
        Calendar.createEvent({ user: userObject, params: paramsObject, body: event })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Create event failure')))
            .then(() => done());
    });

    it("remove event on google calendar", function (done) {
        Calendar.removeEvent({ user: userObject, params: paramsObject })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(userObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeRemoveGoogleEvent).toHaveBeenCalled();
                expect(response.status).toBe('Remove event successfully');
                expect(response.token).toBeUndefined();
            })
            .then(() => done());
    });

    it("throw error when cannot remove event.", function (done) {
        fakeRemoveGoogleEvent.and.returnValue(new Promise((res, rej) => rej(new Error())));
        Calendar.removeEvent({ user: userObject, params: paramsObject })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Remove event failure')))
            .then(() => done());
    });

    it("update event on google calendar", function (done) {
        Calendar.updateEvent({ user: userObject, params: paramsObject, body: event })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(userObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeUpdateGoogleEvent).toHaveBeenCalled();
                expect(response.status).toBe('Update event successfully');
                expect(response.token).toBeUndefined();
            })
            .then(() => done());
    });

    it("throw error when cannot update event.", function (done) {
        fakeUpdateGoogleEvent.and.returnValue(new Promise((res, rej) => rej(new Error())));
        Calendar.updateEvent({ user: userObject, params: paramsObject, body: event })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Update event failure')))
            .then(() => done());
    });

    it("refresh the access token and return new jwt token if expired.", function (done) {
        Calendar.updateEvent({ user: expiredUserObject, params: paramsObject, body: event })
            .then((response) => {
                expect(authorizeCallThorugh).toHaveBeenCalledWith(expiredUserObject);
                expect(fakeCreateOAuth2Client).toHaveBeenCalled();
                expect(fakeGetRefreshToken).toHaveBeenCalled();
                expect(fakedOAuth2Client.setCredentials).toHaveBeenCalledWith(userCredential);
                expect(fakeUpdateGoogleEvent).toHaveBeenCalled();
                expect(response.status).toBe('Update event successfully');
                expect(response.token).not.toBeUndefined();
            })
            .then(() => done());
    });

    it("throw error when cannot refresh the access token.", function (done) {
        fakeGetRefreshToken.and.returnValue(new Promise((res, rej) => rej(new Error('Refresh access token failure'))));
        Calendar.updateEvent({ user: expiredUserObject, params: paramsObject, body: event })
            .then(() => {
                throw new Error('Promise should not resolve here')
            })
            .catch(err => expect(() => { throw err }).toThrow(new Error('Refresh access token failure')))
            .then(() => done());
    });

});
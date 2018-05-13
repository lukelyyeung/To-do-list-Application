
import "jasmine";
import { AuthService } from '../../service/AuthService';
import { Service, Model } from "../../module";
import * as jwt from "jwt-simple";
import { config } from "../../utils/jwt-config";
import { GOOGLE } from '../../constants/GOOGLE_RESPONSE';
import { AUTH } from '../../constants/AUTH';

const generateJwt = (userPayload: Model.IUserPayload) => jwt.encode(userPayload, config.privateKey, config.jwtAlgorithm);
const verifyJwt = (token: string | undefined) => jwt.decode(token, config.publicKey);

describe("The auth functions should be able to", function () {

    const fakeGoogleAuthObject = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'redirectUri',
    }

    const authorizationCode = { body: { code: "authourization" } };

    // Tokens returned by OAuth2Client.getAccessToken
    const googleTokens = {
        refresh_token: 'refresh_token',
        // expire after 3600s
        expiry_date: (new Date().getTime() + 3600000) / 1000,
        access_token: 'access_token',
        token_type: 'bearer',
        id_token: 'id_token'
    }
    
    // Tokens returned by goog oAuth2 v1 verifying link 
    const googleResponse = {
        id: 'id',
        name: 'John Doe',
        email: 'email',
        picture: 'picture'
    }

    // User info based on the above result from google
    const userInfo = {
        id: googleResponse.id,
        name: googleResponse.name,
        refreshToken: googleTokens.refresh_token,
        accessToken: googleTokens.access_token,
        expiry: googleTokens.expiry_date
    }

    // Payload to be encoded based on the above result from google
    const userPayload = {
        id: googleResponse.id,
        name: googleResponse.name,
        expiry: googleTokens.expiry_date
    }

    // User info to simulate the google access token is expired
    const expiredUserInfo = {
        id: googleResponse.id,
        name: googleResponse.name,
        refreshToken: googleTokens.refresh_token,
        accessToken: googleTokens.access_token,
        expiry: 0
    }
    
    // Decoded payload to simulate the google access token is expired
    const expiredUserPayload = {
        id: googleResponse.id,
        name: googleResponse.name,
        expiry: 0
    }

    let Auth: Service.IAuthService;
    let fakeGetAccessToken: jasmine.Spy,
        fakeGetUserInfo: jasmine.Spy,
        fakeGetRefreshToken: jasmine.Spy,
        fakeFindUser: jasmine.Spy,
        fakeAddUser: jasmine.Spy,
        fakeUpdateUser: jasmine.Spy

    beforeEach(function () {
        Auth = new AuthService(fakeGoogleAuthObject);
        fakeGetAccessToken = spyOn<any>(Auth, 'getAccessToken').and.returnValue(googleTokens);
        fakeGetUserInfo = spyOn<any>(Auth, 'getUserInfo').and.returnValue(googleResponse);
        fakeGetRefreshToken = spyOn<any>(Auth, 'refreshAccessToken').and.returnValue(googleTokens);
        fakeAddUser = spyOn<any>(Auth, 'addUser');
        fakeFindUser = spyOn<any>(Auth, 'findUser');
        fakeUpdateUser = spyOn<any>(Auth, 'updateUser');
    });

    it("return a jwt token when login with google email account.", function (done) {
        Auth.googleLogin(authorizationCode)
            .then((status) => {
                expect(fakeGetAccessToken).toHaveBeenCalledWith(authorizationCode.body.code);
                expect(fakeGetUserInfo).toHaveBeenCalledWith(googleTokens.access_token);
                expect(fakeGetRefreshToken).not.toHaveBeenCalled();
                expect(fakeFindUser).toHaveBeenCalledWith(googleResponse.id);
                expect(fakeAddUser).toHaveBeenCalledWith(userInfo);
                expect(status.status).toEqual(AUTH.LOGIN_SUCCESS);
                expect(verifyJwt(status.token)).toEqual(userPayload);
            })
            .then(() => done());
    });

    
    it("throw error when the authorization code is invalid", function (done) {
        fakeGetAccessToken = fakeGetAccessToken.and.returnValue(undefined);
        Auth.googleLogin(authorizationCode)
        .then(() => { throw new Error('Promise should not be resolved') })
        .catch((error) => (expect(() => { throw error }).toThrow(new Error(GOOGLE.GET_ACCESS_TOKEN_FAIL))))
        .then(() => done());
    });
    
    it("throw error when no user info is returned from google verification link.", function (done) {
        fakeGetUserInfo = fakeGetUserInfo.and.returnValue(undefined);
        Auth.googleLogin(authorizationCode)
        .then(() => { throw new Error('Promise should not be resolved') })
        .catch((error) => (expect(() => { throw error }).toThrow(new Error(GOOGLE.GET_USER_ID_FAIL))))
        .then(() => done());
    });
    
    it("throw AUTH.LOGIN_FAIL error when there are other error", function (done) {
        fakeFindUser = fakeFindUser.and.throwError('Error is thrown for testing purpose');
        Auth.googleLogin(authorizationCode)
            .then(() => { throw new Error('Promise should not be resolved') })
            .catch((error) => (expect(() => { throw error }).toThrow(new Error(AUTH.LOGIN_FAIL))))
            .then(() => done());
    });

    it("verify the jwt token to login.", function (done) {
        const token = generateJwt(userPayload);
        fakeFindUser = fakeFindUser.and.returnValue(userInfo);
        Auth.jwtLogin({ headers: { authorization: `Bearer ${token}` } })
            .then((status) => {
                expect(fakeFindUser).toHaveBeenCalledWith(googleResponse.id);
                expect(status.status).toEqual(AUTH.LOGIN_SUCCESS);
                expect(status.token).toBeUndefined();
            })
            .then(() => done())
    });

    it("distinguish the invalid jwt token.", function (done) {
        const token = generateJwt({ id: 'id', name: 'John Doe', expiry: 0 });
        fakeFindUser = fakeFindUser.and.returnValue(userInfo);
        Auth.jwtLogin({ headers: { authorization: `Bearer ${token}` } })
            .then(() => { throw new Error('Promise should not be resolved') })
            .catch(err => expect(() => { throw err }).toThrow(new Error(AUTH.INVALID_JWT)))
            .then(() => done())
    });

    it("throw error when no user is found.", function (done) {
        const token = generateJwt({ id: 'no id', name: 'not a user', expiry: 0 });
        fakeFindUser = fakeFindUser.and.returnValue(undefined);
        Auth.jwtLogin({ headers: { authorization: `Bearer ${token}` } })
            .then(() => { throw new Error('Promise should not be resolved') })
            .catch(err => expect(() => { throw err }).toThrow(new Error(AUTH.NO_USER)))
            .then(() => done())
    });

    it("refresh the jwt token is expired", function (done) {
        const token = generateJwt(expiredUserPayload);
        fakeFindUser = fakeFindUser.and.returnValue(expiredUserInfo);
        Auth.jwtLogin({ headers: { authorization: `Bearer ${token}` } })
            .then((status) => {
                expect(fakeGetRefreshToken).toHaveBeenCalledWith({
                    access_token: googleTokens.access_token,
                    refresh_token: googleTokens.refresh_token,
                    expiry_date: expiredUserPayload.expiry
                });
                expect(fakeUpdateUser).toHaveBeenCalledWith(userInfo);
                expect(status.status).toEqual(AUTH.LOGIN_SUCCESS);
                expect(verifyJwt(status.token)).toEqual(userPayload);
            })
            .then(() => done())
    });

    it("throw error when fail to refresh the jwt token", function (done) {
        const token = generateJwt(expiredUserPayload);
        fakeFindUser = fakeFindUser.and.returnValue(expiredUserInfo);
        fakeGetRefreshToken = fakeGetRefreshToken.and.returnValue(undefined)
        Auth.jwtLogin({ headers: { authorization: `Bearer ${token}` } })
        .then(() => { throw new Error('Promise should not be resolved') })
        .catch(err => (expect(() => { throw err }).toThrow(new Error(GOOGLE.REFRESH_ACCESS_TOKEN_FAIL))))
        .then(() => done());
    });
});
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { config } from './jwt-config';
import { findUser } from './user';
const { ExtractJwt } = passportJWT;

export default () => {
    try {
        const strategy = new passportJWT.Strategy({
            secretOrKey: config.publicKey,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, async (payload, done) => {
            let user = await findUser(payload.id);
            if ( user && user.expiry === payload.expiry) {
                return done(null, {
                    id: user.id,
                    name: user.name,
                    refreshToken: user.refreshToken,
                    accessToken: payload.accessToken,
                    expiry: payload.expiry
                });
            } else {
                return done(new Error('Invalid User Token.'), null);
            }
        });

        passport.use(strategy);

        return {
            initialize: function () {
                return passport.initialize();
            },
            authenticate: function () {
                return passport.authenticate("jwt", config.jwtSession);
            }
        };
    } catch (err) {
        console.log(err);
        return;
    }
}
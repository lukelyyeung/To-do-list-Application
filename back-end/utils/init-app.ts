import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as session from 'express-session';
import initPassport from './init-passport';

// Export the function to set up the app
export default (express: any) => {
    const app = express();
    app.use(cors());
    const auth = initPassport();
    app.use(bodyParser.json());
    app.use(session({
        secret: 'supersecret',
        resave: true,
        saveUninitialized: true
    }));
    
    if (auth) {
        app.use(auth.initialize());
    }

    return { app, auth };
}   
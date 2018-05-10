import * as express from 'express';
import * as dotenv from 'dotenv';
import initApp from './utils/init-app';
import { AuthRouter } from './routers/AuthRouter';
import { CalendarRouter } from './routers/CalenderRouter';
import { AuthService } from './service/AuthService';
import { CalendarService } from './service/CalenderService';
dotenv.config();

const googleAuthObject = {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || ''
}
const { app, auth } = initApp(express);
const [authService, calendarService] = [new AuthService(googleAuthObject), new CalendarService(googleAuthObject)];

if (!app || !auth) {
    throw new Error();
}

app.use('/api/v1/auth', new AuthRouter(authService).router());
app.use('/api/v1/calendar', auth.authenticate(), new CalendarRouter(calendarService).router());
app.listen(8080, () => console.log('Listen to 8080.'));
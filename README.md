#To-Do-List Application#

## Set up ##
1. Simply run ```./install``` at root directory to install the dependency.
2. Put your google calendar client id and secret in the /back-end/.env as below. The private key and public key are provided. 
```
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_Id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
```
3. Run ```./serve``` to start server. back-end will be ran at port 8080 while front-end will be at port 3000.

## Testing ##
1. Run ```npm test``` at root directory of back-end. 28 spec for the unit test of the service.
2. As the test case will utlilize the json fake database. The credentials.json will be truncated everytime after the test case rans.
2. Front-end test case not yet finished.

## Other reminders ##
1. In term of UX, I prefer the items will be fetched automatically once the user logged in so I made a little change on the landing page.
    Please let me know how your feel and inform me if you do like to have the fetch item on the landing page.
2. The back-end api is designed with capability to fetch items from non-primary calendar and receive multiple query string when fetching event list.
    However, for the sake of time, the implementation in front-end was not been considered.
3. To minimize the your set-up time, I choose to use json to mimic database. Please let me know if setting-up of DB is necessary.
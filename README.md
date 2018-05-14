## To-Do-List Application ##

### Set up ###
1. Simply run ```cd back-end && npm install & cd front-end && yarn install``` at root directory to install the dependency.
2. Go to https://console.developers.google.com/apis/dashboard to register a porject and enable google calendar api
3. At 'Credentials', press 'Create credentials' and choose 'OAuth Client ID', and then 'web application', 
   paste http://localhost:3000 to the redirect uri and javascript origin, finally press create.
4. Download your client_secret.json, put your google calendar client id and secret in the /back-end/.env as below. The private key and public key are provided. 
```
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_Id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret

```
Also put the client id into /front-end/.env
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_calendar_Id
```
5. Run ```./serve.sh``` or ```cd back-end && npm start & cd front-end && yarn start``` to start server. Back-end will be ran at port 8080 while front-end will be at port 3000.
6. The application is also deployed on http://to-do-list-lukelyyeung.surge.sh/ for testing purpose.

### Testing ###
1. Run ```npm test``` at root directory of back-end. 28 spec for the unit test of the service.
2. As the test case will utlilize the json fake database. The credentials.json will be truncated everytime after the test case rans.
2. Run ```yarn test``` at root directory of front-end. Front-end test case not yet finished.

### Other reminders ###
1. In term of UX, I prefer the items will be fetched automatically once the user logged in so I made a little change on the landing page.
    Please let me know how your feel and inform me if you do like to have the fetch item on the landing page.
2. The back-end api is designed with capability to fetch items from non-primary calendar and receive multiple query string when fetching event list.
    However, for the sake of time, the implementation in front-end was not been considered.
3. To minimize the your set-up time, I choose to use json to mimic database. Please let me know if setting-up of DB is necessary.
4. No build file is included as the front-end requires a consistent google client_id with back-end to work.

### Updates since last commit ###
1. Provided handling function to ```onFailure``` property of ```react-google-login``` component. This fixed the uncaught error: f is a not a function when component fail to render the iFrame for login.
2. Added checking function in ```componentDidUpdated``` hook of ```item``` component to re-fetch event details if the parent's props (updated / reminders) changes.
3. Fixed the display bug of the back-end test case by deleting the ```console.log``` in ```catch``` block of the user.ts.
4. Rewrote the npm script of the back-end in a way taht run local ```ts-node```, ```nodemon``` and ```jasmine``` instead of requiring global installation of those libraries.

import * as dotenv from 'dotenv';
dotenv.config({path: './.env'});
const publicKey = process.env.JWT_PUBLIC_KEY ? process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n') : '';
const privateKey = process.env.JWT_PRIVATE_KEY ? process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n') : '';

export const config = {
    privateKey: privateKey,
    publicKey: publicKey,
    jwtSession: {
        session: false
    },
    jwtAlgorithm: "RS256"
}
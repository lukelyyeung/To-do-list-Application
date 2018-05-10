import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from '../module';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const USER_PATH = path.join(__dirname, '../credentials.json');

export const findUser = (id: string): Promise<Model.IUserInfo | undefined> => readFileAsync(USER_PATH, { encoding: 'utf-8' })
    .then(Users => {
        if (Users) {
            const user: Model.IUserInfo = JSON.parse(Users).find((user: Model.IUserInfo) => user.id === id);
            return user;
        }

        return;
    })
    .catch(err => {
        // console.log(err);
        throw new Error('Load user file failed');
    });

export const addUser = (userInfo: Model.IUserInfo) =>
    readFileAsync(USER_PATH, { encoding: 'utf-8' })
        .then(users => {
            let userArray: any[] = users ? JSON.parse(users) : [];
            return userArray.concat([userInfo]);
        })
        .then(updatedUsers => writeFileAsync(USER_PATH, JSON.stringify(updatedUsers), { encoding: 'utf8', flag: 'w' }))
        .catch(err => {
            // console.log(err);
            throw new Error('Write user file failed');
        });

export const updateUser = (newUserInfo: Model.IUserInfo) => readFileAsync(USER_PATH, { encoding: 'utf-8' })
    .then(Users => {
        return JSON.parse(Users).map((user: Model.IUserInfo) => {
            if (user.id === newUserInfo.id) {
                return { ...user, ...newUserInfo }
            }
            return user;
        });
    })
    .then(updatedUsers => writeFileAsync(USER_PATH, JSON.stringify(updatedUsers), { encoding: 'utf8', flag: 'w' }))
    .catch(err => {
        // console.log(err);
        throw new Error('Update user file failed');
    });
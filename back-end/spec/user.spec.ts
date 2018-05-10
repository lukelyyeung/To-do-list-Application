
import "jasmine";
import { promisify } from 'util';
import * as fs from 'fs';
import { addUser, findUser, updateUser } from '../utils/user';
const writeFilePromise = promisify(fs.writeFile);
const readFilePromise = promisify(fs.readFile);
const removeFilePromise = promisify(fs.unlink);
const USER_PATH = './credentials.json';


describe("The user functions should be able to", function () {
    
    const readFile = () => 
        readFilePromise(USER_PATH, {encoding: 'utf8'})
        .then(data => JSON.parse(data));
    const truncateFile = () =>
         writeFilePromise(USER_PATH, JSON.stringify([]), { encoding: 'utf8', flag: 'w' });
    const eraseFile = () => 
        removeFilePromise(USER_PATH);

    const testUser = {
        id: '12345',
        name: 'John Doe',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiry: 1525807549983
    }
    
    const testUserUpdated = {
        id: '12345',
        name: 'John Doe Updated',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiry: 1525807600000
    }

    beforeEach(function(done) {
        truncateFile().then(() => done());
    });
    
    afterEach(function(done) {
        truncateFile().then(() => done());
    });

    it("add new user", function (done) {
        addUser(testUser)
        .then(()=> readFile())
        .then(data => {
            expect(data[0].id).toEqual(testUser.id);
            expect(data[0].name).toEqual(testUser.name);
            expect(data[0].accessToken).toEqual(testUser.accessToken);
            expect(data[0].refreshToken).toEqual(testUser.refreshToken);
            expect(data[0].expiry).toEqual(testUser.expiry);
        })
        .then(()=>done());
    });

    it("find user with id", function(done) {
        addUser(testUser)
        .then(()=> findUser(testUser.id))
        .then(data => {
            if (!data) {
                expect(data).not.toBeUndefined;
            } else {
                expect(data.id).toEqual(testUser.id);
                expect(data.name).toEqual(testUser.name);
                expect(data.accessToken).toEqual(testUser.accessToken);
                expect(data.refreshToken).toEqual(testUser.refreshToken);
                expect(data.expiry).toEqual(testUser.expiry);
            }
        })
        .then(()=>done());
    })

    it("return undefined when no user is match", function(done) {
        addUser(testUser)
        .then(()=> findUser(testUser.id))
        .then(data => {
                expect(data).toBeUndefined;
        })
        .then(()=>done());
    })

    it("update a user by merge new information", function(done) {
        addUser(testUser)
        .then(()=> updateUser(testUserUpdated))
        .then(()=> findUser(testUser.id))
        .then(data => {
            if (!data) {
                expect(data).not.toBeUndefined;
            } else {
                expect(data.id).toEqual(testUser.id);
                expect(data.name).toEqual(testUserUpdated.name);
                expect(data.accessToken).toEqual(testUser.accessToken);
                expect(data.refreshToken).toEqual(testUser.refreshToken);
                expect(data.expiry).toEqual(testUserUpdated.expiry);
            }
        })
        .then(()=>done());
    })

    it("will throw error when fail to read user file.", function(done) {
        eraseFile()
        .then(()=>findUser(testUser.id))
        .then(() => { throw new Error('Promise should not be resolved')})
        .catch(err => expect(() => {throw err}).toThrow(new Error('Load user file failed')))
        .then(()=> done());
    })

    it("will throw error when fail to write file during add user.", function(done) {
        eraseFile()
        .then(()=>addUser(testUser))
        .then(() => { throw new Error('Promise should not be resolved')})
        .catch(err => expect(() => {throw err}).toThrow(new Error('Write user file failed')))
        .then(()=> done());
    })

    it("will throw error when fail to write file during add user.", function(done) {
        eraseFile()
        .then(()=>updateUser(testUser))
        .then(() => { throw new Error('Promise should not be resolved')})
        .catch(err => expect(() => {throw err}).toThrow(new Error('Update user file failed')))
        .then(()=> done());
    })
})
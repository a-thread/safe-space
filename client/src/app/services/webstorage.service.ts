import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

//  Name of stored data in the browsers session or local storage
const STORAGE_KEY = 'user-data';

@Injectable()
export class UserSessionStorageService {

    // "storage" is what we refer to in order to access anything stored in the browser, the follow that but our STORAGE_KEY to specify which data we want to access/manipulate
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient) {

    }

    public doSomethingAwesome(data): Object {

        //  Get the data in storage
        const awesomenessLevel: Object = this.storage.get(STORAGE_KEY) || {};  // not sure what 1337 is, by "not sure" I mean I have no idea

        //  Give that data a value, or manipulate the value
        this.storage.set(STORAGE_KEY, data);
        return awesomenessLevel;
    }

    // public postUserDataToDb(data) {

    // }

    public async setupLocalStorage(authData) {
        console.log('start: setUpLocalStorage');

        console.log('authData ', authData);

        let dbData = await this.getDataFromDb(authData.sub);

        if (!dbData) {
            console.log('\nNO DB DATA\n');
            
            dbData = await this.configureAuthData(authData);
            this.saveDataToDb(dbData);

        }

        console.log('dbData returned to setupLocalStorage', dbData);

        this.saveDataLocally(dbData);

        console.log('end: setUpLocalStorage');

    }

    public getDataFromLocal(): Object {
        console.log('start: getDataFromLocal');

        const localStorage = this.storage.get(STORAGE_KEY) || {};
        console.log('data from local storage', localStorage);


        console.log('end: getDataFromLocal');

        return localStorage;
    }

    private configureAuthData(authData) {

        let subArray = authData.sub.split('|');  //  original style: auth|23498671034958
        console.log('subArray === ', subArray);

        let nameArray = ['', ''];
        if (!authData.name.split('').includes("@")) {
            nameArray = authData.name.split(' ');
        }


        return {
            firstName: nameArray[0],
            lastName: nameArray[1],
            email: authData.email,
            username: authData.nickname,
            subId: subArray[1],
            picture: authData.picture
        }
    }

    private async getDataFromDb(sub) {
        console.log('start: getDataFromDb');


        const dbData = await this.http.get(`/api/user/sub/test/${sub}`).toPromise();
        console.log('\nresponse from DB using sub - should be all user data === ', dbData);

        console.log('end: getDataFromDb');

        return dbData[0];


    }

    private saveDataLocally(data) {
        console.log('start: saveDataLocally');

        console.log('what is being saved', data);

        this.storage.set(STORAGE_KEY, data);

        console.log('end: saveDataLocally');
    }

    private saveDataToDb(data) {
        this.http.post('api/user', data);
    }
}
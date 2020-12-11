import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';

//  Session and/or Local storage
import { UserSessionStorageService } from "../../services/webstorage.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        public auth: AuthService,
        public storage: UserSessionStorageService
    ) { }

    public authData: any;
    public userProfileForm: FormGroup;
    public pronounSelection: string;
    public email = new FormControl('', [Validators.required, Validators.email]);
    static onProfileUpdate: any;
    public posted: boolean = false;

    public profileData: { 
        username: string; 
        pronouns: string; 
        location: string; 
        email: string; 
        moreInfo: string; 
        photo: string; };

    public user = {
        username: '',
        pronouns: '',
        moreInfo: '',
        photo: '',
        location: ''
    };

    ngOnInit(): void {
        this.loadProfileDataFromLocalStorage();
        this.createForm();
    }

    createForm() {
        // to test email format
        let EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        this.userProfileForm = this.formBuilder.group({
            'username': [null],
            'pronouns': [null],
            'location': [null],
            'email': [null, [Validators.pattern(EMAIL_REGEXP)]],
            'moreInfo': [null],
            'photo': [null]
        });
    }

    getErrorMessage() {
        return this.email.hasError('required') ? 'you must enter an email address' :
            this.email.hasError('email') ? 'not a valid email' :
                '';
    }

    // checking formatting of email
    getErrorEmail() {
        return this.userProfileForm.get('email').hasError('pattern') ? 'Not a valid email address.' : '';
    }

    //  EVENT where user submits new data to update their profile
    async onProfileUpdate(profileData: { username: string; pronouns: string; location: string; email: string; moreInfo: string; photo: string; }) {

        //  IF no data was submitted
        if (!profileData.username && !profileData.pronouns && !profileData.location && !profileData.email && !profileData.moreInfo && !profileData.photo) {

            // we alert the user that they didn't enter anything
            return alert("You must enter data into one of the fields in order to update your profile.")

            // otherwise
        } else {

            // we SAVE submitted data to Local Storage
            await this.saveToLocalStorage(profileData);

            //  UPDATE the user's data in the database
            this.updateUserInDb();

            //  Reload users updated data from Local Storage
            this.loadProfileDataFromLocalStorage();
        }

        // creates a new form
        this.createForm();

        // alerts 
        this.posted = true;
    }

    //  SAVEs data to Local Storage after checking the new data against the currently saved data in Local Storage
    async saveToLocalStorage(data: any) {

        const newData = await this.checkNewDataForUpdates(data);

        this.storage.saveDataLocally(newData);
        this.profileData = newData;

        // alert("Your information has been updated!");
    }

    //  GET user data from Local Storage and assign the values to 'this.user'
    async loadProfileDataFromLocalStorage() {

        const localStorageData = await this.storage.getDataFromLocal();

        if (!localStorageData.pronouns) {
            this.user.pronouns = 'Not Specified';
        } else {
            this.user.pronouns = localStorageData.pronouns;
        }
        if (!localStorageData.moreInfo) {
            this.user.moreInfo = 'No bio... Does this person even exist?';
        } else {
            this.user.moreInfo = localStorageData.moreInfo;
        }

        this.user.photo = localStorageData.photo;
        this.user.username = localStorageData.username;
        this.user.moreInfo = localStorageData.moreInfo;
    }

    //  UPDATE user's data in the database by grabbing the current data in Local Storage
    async updateUserInDb() {
        const localStorageData = await this.storage.getDataFromLocal();
        const url: string = `/api/user/${localStorageData.subId}`;

        this.http.patch(url, localStorageData)
            // and returning the id of the response
            .subscribe((response) => {
                console.log(response); //  this 'response' will say {user: updated} as an object
            })
    }

    //  Given some data, we compare it to Local Storage and return updated information and old information it user didn't want to update it
    async checkNewDataForUpdates(data: any) {

        //  GET user data from Local Storage
        const localStorageData = await this.storage.getDataFromLocal();

        //  Create an array of all possibly changing data
        const possiblyChangingDataArray = [
            "username",
            "moreInfo",
            "pronouns",
            "location",
            "moreInfo",
            "photo"
        ];

        //  Creating an object to hold the data from Local Storage that isn't getting updated
        //  this is the only way I could think of to not lose this data
        const nonChangingData = {
            photo: localStorageData.photo,
            subId: localStorageData.subId,
            email: localStorageData.email,
            favoriteBusinesses: localStorageData.favoriteBusinesses,
            reviewedBusinesses: localStorageData.reviewedBusinesses,
            firstName: localStorageData.firstName,
            lastName: localStorageData.lastName
        }
            ;

        //  Create an object to hold our updated information, first loading it with the current data submitted for update
        let newData = {
            ...data
        };

        //  ITERATE over new data, if a category was not submitted for an update then we overwrite that category with the equivalent category currently in Local Storage
        possiblyChangingDataArray.forEach(category => {

            //  IF new data DOESN'T exists,
            if (newData[category] === undefined || newData[category] === null || newData[category] === '') {

                //  We add the corresponding data from Local Storage
                newData[category] = localStorageData[category];
            }
        });

        //  Combine data that doesn't get updated with the newData object that includes new data and old Local Storage data that wasn't updated
        let updatedData = {
            ...nonChangingData,
            ...newData
        };

        //  RETURN our the updated object of user data, to then set to update Local Storage
        return updatedData;

    }

}

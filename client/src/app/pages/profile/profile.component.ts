import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public auth: AuthService
  ) { }

  public authData: any;
  public userProfileForm: FormGroup;
  public profileData = '';
  public pronounSelection: string;
  public email = new FormControl('', [Validators.required, Validators.email]);
  static onProfileUpdate: any;
  public user = {
    photo: '',
    firstName: '',
    lastName: '',
    sub: '',
    email: '',
    username: '',
    pronouns: '',
    location: ''
  };

  ngOnInit(): void {
    this.auth.userProfile$.subscribe(data => {
      console.log(data);
      this.user = data;

      let nameArray = data.name.split(' ');
      console.log('nameArray === ', nameArray);

      this.user.photo = data.picture;
      this.user.firstName = nameArray[0];
      this.user.lastName = nameArray[1];
      this.user.username = data.nickname;
      this.user.email = data.email;
      let subArray = data.sub.split('|');
      console.log('subArray === ', subArray);

      this.user.sub = subArray[1];
      console.log('this.user.sub === ', this.user.sub);

    })
    this.createForm();

  }

  createForm() {
    // to test email format
    let EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    this.userProfileForm = this.formBuilder.group({
      'username': [null],
      'pronouns': [null],
      'location': [null],
      'email': [null, [Validators.pattern(EMAIL_REGEXP)]]
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

  checkProfileData(profileData) {

    const {
      username,
      email
    } = profileData;

    const data = [username, email];

    data.forEach(category => {
      if (category) {
        switch (category) {
          case username:
            this.user.username = username;
            break;
          case email:
            this.user.email = email;
            break;
          default:
            break;
        }
      }
    })
  }

  async onProfileUpdate(profileData) {
    console.log('profileData === ', profileData);

    if (!profileData.username && !profileData.pronouns && !profileData.location && !profileData.email) {
      return alert("You must enter data into one of the fields in order to update your profile.")
    } else {
      this.user.location = profileData.location;
      this.user.pronouns = profileData.pronouns;

      const url: string = await `/api/user/${this.user.sub}`;
      console.log('url === ', url);

      console.log('this.user === ', this.user);

      await this.checkProfileData(profileData);

      await this.http.patch(url, this.user)
        // and return the id of the response
        .subscribe((response) => {
          console.log('response ', response);
        })
    }
  }

}

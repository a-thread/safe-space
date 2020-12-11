import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})

export class ResourceFormComponent implements OnInit {

  constructor( private formBuilder: FormBuilder, private http: HttpClient ) { }
  
  
  public businessForm: FormGroup;
  public titleAlert: string = 'This field is required';
  public post: any = '';
  public selectedState = 'option2';
  public selectedType = 'option2';
  public selectedBool = 'option2';


  ngOnInit() {
    this.createForm();
  }

  createForm() {
    // to test email format
    let EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // to test website format
    let URL_REGEXP: RegExp = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

    this.businessForm = this.formBuilder.group({
      'type': [null, Validators.required],
      'name': [null, Validators.required],
      'city': [null, Validators.required],
      'state': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      'website': [null, [Validators.required, Validators.pattern(URL_REGEXP)]],
      'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(400)]],
      'contactName': [null],
      'phone': [null, [Validators.minLength(10), Validators.maxLength(14)]],
      'email': [null, [Validators.pattern(EMAIL_REGEXP)]],
      'memberOwned': [null, Validators.required]
    });
  }

  // checking formatting of email
  getErrorEmail() {
    return this.businessForm.get('email').hasError('pattern') ? 'Not a valid email address.' : '';
  }

  // checking formatting of website
  getErrorUrl() {
    return this.businessForm.get('website').hasError('required') ? this.titleAlert :
      this.businessForm.get('website').hasError('pattern') ? 'Not a valid url.' : '';
  }

  // checking formatting of state
  getErrorState() {
    return this.businessForm.get('state').hasError('required') ? this.titleAlert :
      this.businessForm.get('state').hasError('maxlength') ? 'Please enter state in abbreviated form.' : '';
  }

  onSubmit(post) {
    // setting to variable to show user
    this.post = post;

    // if form is valid...
    if (this.businessForm.valid) {
      // it will post to database
      this.http.post('/api/business', post)
      // and return the id of the response
      .subscribe((response)=>{
        console.log('response ', response);
      })
    }
  }
}

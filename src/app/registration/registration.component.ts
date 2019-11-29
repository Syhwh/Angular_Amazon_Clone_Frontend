import { Component, OnInit } from '@angular/core';

import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  repassword = '';
  isSeller = false;
  btnDisable = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
  }

  validate() {
if (this.name) {
  if (this.email) {
    if (this.password) {
      if (this.repassword) {
        if (this.password === this.repassword) {
          return true;
        } else {
          this.data.error('Passwords do not match');
        } // close password match
        } else {
          this.data.error('Confirmation Password is not entered.');
        } // close re password
      } else {
        this.data.error('Pasword is not entered.');
      } // close this.password
    } else {
    this.data.error('Email is not entered.');
    } // close this. email
  } else {
  this.data.error('Name is not entered');
  } // close name
} // close validate

async register() {
  this.btnDisable = true;
  try {
    if (this.validate()) {
    const data = await this.rest.post (
      'http://localhost:3030/api/accounts/signup',
      {
        name: this.name,
        email: this.email,
        password: this.password,
        isSeller: this.isSeller
      }
    );
    if (data [`success`]) {
      localStorage.setItem('token', data[`token`]);
      // this.data.success('Registration Succesful');
      await this.data.getProfile();
      this.router.navigate([`profile/address`])
      .then(() => {
        this.data.success('Registration Succesful! Please enter your shipping address below.');
      }).catch(error => this.data.error(error));
    } else {
      this.data.error(data[`message`]);
    }

    }
  } catch (error) {
    this.data.error(error[`message`]);
  }
  this.btnDisable = false;
}

}

import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { UserauthService } from '../services/userauth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameFormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
  });


  detailsFormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
    bio: ['', Validators.required]
  });
  // emailFormGroup = this._formBuilder.group({
  //   email: ['', [Validators.required, Validators.email]]
  // });
  otpFormGroup = this._formBuilder.group({
    otp: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]]
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, private userAuth: UserauthService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
  }



  sendOTP() {
    this.userAuth.initiateMailVerification(this.detailsFormGroup.value.email).subscribe(status => {
      console.log(status)
    })
  }

  otpsuccess: boolean = false;
  otpfailure: boolean = false;
  spinnerEnable: boolean = true;
  verifyOTP() {
    this.userAuth.verifyMailOtp(this.detailsFormGroup.value.email, this.otpFormGroup.value.otp).subscribe(status => {
      if (status.message == "success") {
        let user = new UserModel("", this.detailsFormGroup.value.firstName, this.detailsFormGroup.value.lastName, this.detailsFormGroup.value.email, this.detailsFormGroup.value.bio, "Online", this.detailsFormGroup.value.phone, "", [], this.usernameFormGroup.value.username, this.detailsFormGroup.value.password);
        this.userAuth.signUpUser(user).subscribe(status => {
          if (status.message == "success") {
            this.otpsuccess = true;
            this.spinnerEnable = false;
          }
        })
      }
      else {
        this.otpfailure = true;
        this.spinnerEnable = false;
      }
    })
  }

  usernamePage = true;
  usernameTaken = false;
  usernameLoginButtonDisabled = true;
  detailsPage = false;
  passwordPage = false;
  emailPage = false;
  emailTaken = false;
  verifyButtonDisable = false;
  otpPage = false;

  hidePassword = true;


  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  phone = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]);
  bio = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  userNameFixer() {
    let value = this.username.value;
    value = value.toLowerCase();
    value = value.replace(/[^A-Z0-9]+/ig, "_");
    if (value[0] === "_") {
      value = value.substring(1);
    }
    this.username.setValue(value);
    this.duperUsernameCheck()
  }

  duperUsernameCheck() {
    this.usernameLoginButtonDisabled = true;
    this.userAuth.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "notfound") {
        this.usernameTaken = false;
        this.usernameLoginButtonDisabled = false;
      }
      else if (status.message == "found") {
        this.usernameTaken = true;
        this.username.setErrors({ 'incorrect': true })
      }
    });
  }

  openNamePage() {
    this.usernameLoginButtonDisabled = true;
    this.userAuth.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "notfound") {
        this.usernameTaken = false;
        this.usernameLoginButtonDisabled = false;
        this.usernamePage = false;
        this.detailsPage = true;
      }
      else if (status.message == "found") {
        this.username.setErrors({ 'incorrect': true })
        this.usernameTaken = true;
      }
    });
  }

  sendOtp() {
    this.verifyButtonDisable = true;
    this.userAuth.dupeEmailCheck(this.email.value).subscribe(status => {
      if (status.message == "found") {
        this.email.setErrors({ 'incorrect': true })
        this.emailTaken = true;
        this.verifyButtonDisable = false;
      }
      else {
        this.emailPage = false;
        this.otpPage = true;
      }
    })
  }

  test() {
    console.log(this.lastName.value)
  }


  ngOnInit(): void {
  }

}

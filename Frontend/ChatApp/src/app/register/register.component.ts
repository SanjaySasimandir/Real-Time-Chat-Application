import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
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

  userNameFixer(value: string) {
    value = value.toLowerCase();
    value = value.replace(/[^A-Z0-9]+/ig, "_")
    if (value[0] === "_") {
      value = value.substring(1)
    }
    return value
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
        let user = new UserModel("", this.detailsFormGroup.value.firstName, this.detailsFormGroup.value.lastName, this.detailsFormGroup.value.email, this.detailsFormGroup.value.bio, "Online", this.detailsFormGroup.value.phone, "", []);
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

  ngOnInit(): void {
  }

}

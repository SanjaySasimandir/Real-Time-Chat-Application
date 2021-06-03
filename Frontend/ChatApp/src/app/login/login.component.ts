import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserauthService } from '../services/userauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userAuth: UserauthService, private router: Router) { }


  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  usernamePage = true;
  hidePassword = true;


  passwordSubmit() {
    console.log('here')
    this.userAuth.loginUser(this.username.value, this.password.value).subscribe(status => {
      if (status.message == "success") {
        this.router.navigate(['/']);
      }
    })
  }

  ngOnInit(): void {
  }

}

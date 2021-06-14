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

  loginError = false;

  passwordSubmit() {
    this.userAuth.loginUser(this.username.value, this.password.value).subscribe(status => {
      if (status.message == "success") {
        this.loginError = true;
        localStorage.setItem('token', 'true');
        localStorage.setItem('id', status.id);
        localStorage.setItem('username', status.username);
        this.router.navigate(['/chat']);
      }
      else {
        this.loginError = true;
      }
    })
  }

  ngOnInit(): void {
  }

}

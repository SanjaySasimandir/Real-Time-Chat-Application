import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }


  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  usernamePage = true;
  hidePassword = true;

  ngOnInit(): void {
  }

}

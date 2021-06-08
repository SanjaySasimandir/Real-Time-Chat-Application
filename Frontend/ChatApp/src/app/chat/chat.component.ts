import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserauthService } from '../services/userauth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router: Router, public userAuth: UserauthService) { }

  logout() {
    this.userAuth.logOutUser().subscribe(status => {
      if (status.message == "success") {
        console.log('logoute')
        this.router.navigate(['/']);
      }
    });
  }

  searchItem = new FormControl('', Validators.required);
  test() {
    console.log(this.searchItem.value);
  }

  ngOnInit(): void {
  }

}

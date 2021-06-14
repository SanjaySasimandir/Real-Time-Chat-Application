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

  searchItem = new FormControl('');
  searchResult = {
    username: '',
    firstName: '',
    lastName: '',
    picture: ''
  }
  searchLoadingEnable = false;
  searchUser() {
    this.searchLoadingEnable = true;
    this.searchResult = { username: '', firstName: '', lastName: '', picture: '' };
    this.userAuth.userSearch(this.searchItem.value).subscribe(data => {
      if (data.user) {
        this.searchLoadingEnable = false;
        this.searchResult = data.user;
      }
      this.searchLoadingEnable = false;
    });
  }

  reroute(username: string) {
    this.router.navigate(['/chat/' + username]);
  }

  consolefunction(){
    console.log('here from parent')
  }

  test() {
    console.log(this.searchItem.value);
  }

  ngOnInit(): void {
  }

}

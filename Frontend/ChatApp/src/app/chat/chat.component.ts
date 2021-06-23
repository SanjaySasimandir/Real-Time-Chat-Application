import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactModel } from '../models/contact.model';
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
  searchResult = new ContactModel('', '', '', '');
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

  contacts: ContactModel[] = [];
  noContacts = false;
  mutedContacts: string[] = [];
  blockedContacts: string[] = [];
  loadContacts() {
    this.userAuth.getContacts().subscribe(data => {
      if (data.message == "success") {
        this.contacts = data.contacts;
        this.mutedContacts = data.mutedContacts;
        this.blockedContacts = data.blockedContacts;
        this.noContacts = false;
      }
      else {
        this.noContacts = true;
      }
      console.log(this.contacts)
    });
  }

  onlineContacts: ContactModel[] = [];
  loadOnlineContacts() {
    this.userAuth.getOnlineContacts().subscribe(data => {
      if (data.message == "success") {
        this.onlineContacts = data.contacts;
      }
    });
  }

  selectedContact = new ContactModel('', '', '', '');
  selectContact(contact: ContactModel) {
    this.selectedContact = contact;
  }

  reroute(username: string) {
    this.router.navigate(['/chat/' + username]);
  }

  consolefunction() {
    console.log('here from parent')
  }

  test() {
    console.log(this.searchItem.value);
  }

  ngOnInit(): void {
    this.loadContacts();
    this.loadOnlineContacts();
  }

}

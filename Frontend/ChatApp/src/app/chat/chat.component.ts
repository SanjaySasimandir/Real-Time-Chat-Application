import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactModel } from '../models/contact.model';
import { WebSocketService } from '../services/socket/web-socket.service';
import { UserauthService } from '../services/userauth.service';
import { ChatboxComponent } from './chatbox/chatbox.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild(ChatboxComponent) child!: ChatboxComponent;

  constructor(private router: Router, public userAuth: UserauthService, private webSocket: WebSocketService, private _snackBar: MatSnackBar) { }

  newMessageSnackBar(contactName: string) {
    this._snackBar.open('@' + contactName + ' sent you a message', '', {
      duration: 5000,
    });
  }

  logout() {
    this.userAuth.logOutUser();
    this.router.navigate(['/login']);
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
  selectContactFromSearch(searchContact: ContactModel) {
    console.log(this.contacts.filter(contact => contact.username === searchContact.username));
    this.selectedContact = this.contacts.filter(contact => contact.username === searchContact.username)[0];
    this.child.ngOnInit();
  }

  contacts: ContactModel[] = [];
  noContacts = false;
  mutedContacts: string[] = [];
  blockedContacts: string[] = [];
  loadContacts() {
    this.webSocket.emit('send contacts request', (localStorage.getItem('username')));
    this.webSocket.listen('receive contacts').subscribe((data: any) => {
      if (data.message == "success") {
        this.contacts = data.contacts;
        console.log(this.contacts)
        console.log(this.selectedContact)
        this.mutedContacts = data.mutedContacts;
        this.blockedContacts = data.blockedContacts;
        this.noContacts = false;
      }
      else {
        this.noContacts = true;
      }
    })
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
    setTimeout(() => {
      this.refreshchild(this.selectedContact);
    }, 100);
  }

  refreshchild(contact: any) {
    this.child.ngOnInit()
  }

  addNewContact(contact: ContactModel) {
    this.userAuth.addContactToBoth(contact.username).subscribe(status => {
      if (status.message == "success") {
        this.loadContacts();
      }
    });
  }

  consolefunction() {
    console.log('here from parent')
  }

  test() {
    console.log(this.searchItem.value);
  }

  checkSearchResInContacts(name: string) {
    return !!this.contacts.filter(contact => contact.username == name).length
  }

  ngOnInit(): void {
    this.loadContacts();
    this.loadOnlineContacts();
    this.webSocket.emit('id', localStorage.getItem('username'));
    this.webSocket.listen('new message received').subscribe((data: any) => {
      this.newMessageSnackBar(data.contactName);
    });
    this.webSocket.listen('refresh online contacts').subscribe(status => {
      this.loadOnlineContacts();
    })


  }

}

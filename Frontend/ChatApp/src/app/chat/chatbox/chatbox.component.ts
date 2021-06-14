import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

export class ChatboxComponent implements OnInit {

  @Output() contactrefresh = new EventEmitter();

  parentTest() {
    this.contactrefresh.emit();
  }

  constructor(private activatedRouter: ActivatedRoute, private userAuth: UserauthService) { }

  username = "";
  contact = {
    username: '',
    firstName: '',
    lastName: '',
    picture: ''
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.username = params.username;
      this.userAuth.userSearch(this.username).subscribe(response => {
        if (response.message == "found") {
          this.contact = response.user;
        }
      });
    });
  }

  test() {
    this.userAuth.addContactToBoth(this.contact.username).subscribe(data => {
      console.log(data);
    });
  }

}

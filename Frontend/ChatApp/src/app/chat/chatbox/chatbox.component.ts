import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactModel } from 'src/app/models/contact.model';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

export class ChatboxComponent implements OnInit {

  @Input() contact = new ContactModel('', '', '', '');

  @Output() contactsrefresh = new EventEmitter();

  constructor(private activatedRouter: ActivatedRoute, private userAuth: UserauthService) { }


  newMessage = new FormControl('');

  inputBoxSize = 1;
  inputBoxResize() {
    let lineCount = this.newMessage.value.split('\n').length;
    if (lineCount <= 5) {
      this.inputBoxSize = lineCount;
    }
    console.log(lineCount)
  }

  scrollHeightArray = [53];
  inputBoxResize1(scrollHeight: any) {
    // console.log(scrollHeight)
    if (!this.scrollHeightArray.includes(scrollHeight)) {
      console.log('added', scrollHeight, this.scrollHeightArray)
      this.scrollHeightArray.push(scrollHeight);
    }
    this.inputBoxSize = this.scrollHeightArray.length;

  }

  muted = false;
  blocked = false;

  getMuteBlockStatus() {
    this.userAuth.muteBlockStatus(this.contact.username).subscribe(status => {
      if (status.message == "success") {
        this.muted = status.muteStatus;
        this.blocked = status.blockStatus;
      }
    });
  }

  muteContact() {
    this.userAuth.toggleMute(this.contact.username).subscribe(status => {
      if (status.message == "success") {
        this.muted = status.muteStatus;
        this.contactsrefresh.emit();
      }
    });
  }

  blockContact() {
    this.userAuth.toggleBlock(this.contact.username).subscribe(status => {
      if (status.message == "success") {
        this.blocked = status.blockStatus;
        this.contactsrefresh.emit();
      }
    });
  }

  ngOnInit(): void {
    this.getMuteBlockStatus();
  }

  consoleThis($data: any) {
    console.log($data);
  }

  // test() {
  //   this.userAuth.addContactToBoth(this.contact.username).subscribe(data => {
  //     console.log(data);
  //   });
  // }

}

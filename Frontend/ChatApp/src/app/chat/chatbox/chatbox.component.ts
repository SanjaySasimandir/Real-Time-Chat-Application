import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactModel } from 'src/app/models/contact.model';
import { ChatModel } from 'src/app/models/chat.model';
import { SendMessageModel } from 'src/app/models/sendMessage.model';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

export class ChatboxComponent implements OnInit {

  @Input() contact = new ContactModel('', '', '', '');

  @Output() contactsrefresh = new EventEmitter();

  constructor(private activatedRouter: ActivatedRoute, private userAuth: UserauthService, private webSocket: WebSocketService) { }


  newMessage = new FormControl('');
  uploadToggle: boolean = false;

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
  messagesInChat: ChatModel = new ChatModel('', '', []);
  ngOnInit(): void {
    this.getMuteBlockStatus();
    this.uploadToggle = false;
    this.newMessage.setValue('');
    console.log('here' + this.contact.username)
    this.webSocket.emit('join chat', this.contact.username);

    this.webSocket.listen('receive old messages').subscribe((chat: any) => {
      this.messagesInChat = chat;
      console.log(this.messagesInChat)
    });
    this.webSocket.listen('receive message from contact').subscribe((thing: any) => {
      this.passMessage(thing)
    });

  }
  selectedImage!: FileList;
  imageSelected(element: any) {
    this.selectedImage = element.target.files;
    console.log(this.selectedImage)
  }

  sendImageSelected() {
    var file = this.selectedImage[0];
    var reader = new FileReader();
    reader.onload = this.readerLoaded.bind(this);
    reader.readAsBinaryString(file);
  }

  readerLoaded(evt: any) {
    var binaryString = evt.target.result;
    this.sendImageToSocketandPushtoChat(btoa(binaryString));
  }
  sendImageToSocketandPushtoChat(base64Image: string) {
    let messageToSend = new SendMessageModel(this.username, this.contact.username, base64Image, this.selectedImage[0].type);
    this.webSocket.emit('send message', messageToSend);
    let message = { messageContent: messageToSend.message, messageType: messageToSend.messageType, messageSender: messageToSend.username };
    this.messagesInChat.chat.push(message);

  }

  optionsToggle: boolean = false;

  messageTimes: Number[] = []
  passMessage(data: any) {
    if (!this.messageTimes.includes(data.time)) {
      this.messageTimes.push(data.time);
      this.messagesInChat.chat.push(data.message);
    }
  }

  username = localStorage.getItem('username') || '';
  sendMessage() {
    let messageToSend = new SendMessageModel(this.username, this.contact.username, this.newMessage.value, 'text');
    this.webSocket.emit('send message', messageToSend);
    let message = { messageContent: messageToSend.message, messageType: messageToSend.messageType, messageSender: messageToSend.username };
    this.messagesInChat.chat.push(message);
    this.newMessage.setValue('');
  }

  consoleThis($data: any) {
    console.log($data);
  }


}

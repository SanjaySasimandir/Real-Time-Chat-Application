import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/socket/web-socket.service';
import { UserauthService } from './services/userauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// export class AppComponent {
//   title = 'ChatApp';
// }

export class AppComponent implements OnInit {
  title = 'ChatApp';

  constructor(private webSocket: WebSocketService, private userAuth: UserauthService) { }

  ngOnInit(): void {

    this.webSocket.emit('id', localStorage.getItem('username'));

    this.webSocket.listen('test event').subscribe((data: any) => {
      console.log(data);
    });


  }
}
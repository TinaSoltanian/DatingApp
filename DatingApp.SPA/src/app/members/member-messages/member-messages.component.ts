import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/message';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/Auth.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@Input() userId: number;
messages: Message[];
  constructor(private userService: UserService, 
              private alertify: AlertifyService,
               private authService: AuthService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    this.userService.getMessageThread(this.authService.decodedToken.nameid,  this.userId)
    .subscribe( message => {
      this.messages = message;  
    }, error => {
      this.alertify.error(error);
    });
  }
}

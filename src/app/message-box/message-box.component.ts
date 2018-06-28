import { Component, OnInit } from '@angular/core';
import {Message} from '../message/Message';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  hidden = false;
  messages = [];
  // messageData = [{user: 'doug', date: 'today', text: 'Hello World! 👋'}];

  constructor() {
    const message = new Message();
    message.user = 'doug';
    message.date = ' 5:41 PM';
    message.text = 'Hello World! 👋'
    this.messages.push(message);
  }

  ngOnInit() {

  }

}

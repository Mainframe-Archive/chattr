import { Component, OnInit } from '@angular/core';
import {SwarmService} from '../services/swarm.service';
import {Chat} from '../interface/chat';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {

  message = '';

  constructor(public ss: SwarmService) { }

  ngOnInit() {
  }

  send() {
    console.log('send was clicked: ', this.message);
    this.updateChat();
    this.message = '';
  }

  onKey(value: string) {
    this.message = value;
  }

  updateChat() {
    const chat = JSON.stringify(this.generateChat(this.message));
    this.ss.uploadContent(chat).subscribe((hash: string) => {
      this.ss.updateChat(hash).subscribe((chatFeed: string) => {
        console.log('chatFeed: ', chatFeed);
      });
    });
  }


  generateChat(body: string) {
    const chat: Chat = {
      protocol: 'swarmchat/v0.1',
      utc_timestamp: Date.now() / 1000,
      previous_event_pointer: '',
      type: 'message',
      payload: {
        body: body
      }
    };

    return chat;
  }
}

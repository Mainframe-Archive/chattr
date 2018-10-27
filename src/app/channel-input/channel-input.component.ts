import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-input',
  templateUrl: './channel-input.component.html',
  styleUrls: ['./channel-input.component.css']
})
export class ChannelInputComponent implements OnInit {

  channel_name = '';

  constructor() { }

  ngOnInit() {
  }

  send() {
    console.log('send was clicked: ', this.channel_name);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {

  message = '';

  constructor() { }

  ngOnInit() {
  }

  send() {
    console.log('send was clicked: ', this.message);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.component.html',
  styleUrls: ['./channel-members.component.css']
})
export class ChannelMembersComponent implements OnInit {

  users = [];
  isHidden = true;

  constructor() { }

  ngOnInit() {
    this.users.push({name: 'doug'});
  }


}

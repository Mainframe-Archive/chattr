import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  isDialogueHidden = false;
  isChatHidden = true;
  isCreateHidden = true;
  isJoinHidden = true;

  address = '';
  path = '';
  channel = '';
  values = [];

  constructor() { }

  ngOnInit() {
  }

  submit() {
    console.log('submit was clicked: ', this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = !this.isCreateHidden && !this.isJoinHidden;
    this.isDialogueHidden = !this.isCreateHidden || !this.isJoinHidden;
  }

  cancel() {
    this.isDialogueHidden = false;
    this.isChatHidden = true;
    this.isCreateHidden = true;
    this.isJoinHidden = true;

    this.address = '';
    this.path = '';
    this.channel = '';
    this.values = [];
  }

  showJoin() {
    console.log('showJoin');
    this.isJoinHidden = false;

    this.isDialogueHidden = !this.isJoinHidden;
    this.isDialogueHidden = true;
  }

  showCreate() {
    console.log('showCreate');

    this.isCreateHidden = false;
    this.isDialogueHidden = true;
  }

  onKey(key: string, value: string) {
    console.log(key, value);
    this.values[key] = value;
  }
}

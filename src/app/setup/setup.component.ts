import { Component, OnInit } from '@angular/core';
import {SwarmService} from '../services/swarm.service';
import {generate} from 'rxjs';
import { Channel, ChattrMeta } from '../interface/channel';
import { Chat } from '../interface/chat';


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
  isAddHidden = true;

  address = '';
  path = '';
  channel = '';
  values = [];
  identities = [];

  constructor(public ss: SwarmService) { }

  ngOnInit() {
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
    // console.log(key, value);
    this.values[key] = value;
  }

  submitCreate() {
    console.log('submit was clicked: ', this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = false;
    this.isDialogueHidden = true;
    this.isAddHidden = false;
    this.isCreateHidden = true;
    this.ss.setGethParams(this.values['path'], this.values['address']);
    const channel = this.generateChannel(this.values['channel'], []);
    console.log(channel);
    this.ss.createFeedManifest(this.values['channel'] as string).subscribe((manifest: string) => {
      this.ss.setChannelManifest(manifest, this.values['channel'] as string);
      this.ss.uploadContent(channel).subscribe((data: {}) => {
        console.log(data);
        const channelMeta: ChattrMeta = {
          bzzaccount: this.values['address'] as string,
          password:  this.values['path'] as string,
          name: this.values['channel'] as string,
          data: '0x' + data as string
        };
        console.log(channelMeta);

        this.ss.updateFeed(channelMeta).subscribe((channel_feed: string) => {
          this.ss.setGethParams(this.values['path'], this.values['address']);
          this.createInitialChatFeed();
        });
      });
    });
  }

  submitJoin() {
    console.log('submit was clicked: ', this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = !this.isCreateHidden && !this.isJoinHidden;
    this.isDialogueHidden = !this.isCreateHidden || !this.isJoinHidden;
  }

  createInitialChatFeed() {
    this.ss.createInitalChatManifest().subscribe((manifest: string) => {
      this.ss.setChatManifest(manifest);
      this.identities.push(manifest);
      this.updateChannel();
    });
  }

  addUser() {
    this.identities.push(this.values['newUser'] as string);
    this.updateChannel();
  }

  updateChannel() {
    const channel = this.generateChannel(this.values['channel'] as string, this.identities);
    this.ss.uploadContent(channel).subscribe((data: string) => {
      this.ss.updateChannelIdentities(data);
    });
  }

  generateChannel(name: string, identities: string[]) {
    const channel: Channel = {
      protocol: 'swarmchat/v0.1',
      utc_timestamp: Date.now() / 1000,
      previous_event_pointer: '', // TODO: implement previous_event_pointer
      type: 'channel',
      payload: {
        name: name,
        identities: identities
      }
    };

    return JSON.stringify(channel);
  }

}

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

  address = '02ad4272c7c7ec9a0f79c280f3e82136a832c611';
  path = '/Users/doug/Desktop/swarm_password2';
  channel = 'channel1';
  values = [];
  identities = [];
  constructor(public ss: SwarmService) {
    this.values['address'] = '02ad4272c7c7ec9a0f79c280f3e82136a832c611';
    this.values['path'] = '/Users/doug/Desktop/swarm_password2';
    this.values['channel'] = 'channel1';

  }

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
      manifest.replace(/[^A-Za-z0-9]/g, '');
      this.ss.setChannelManifest(manifest, this.values['channel'] as string);
      console.log('about to upload:⏰ ', channel);
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
      const cleanManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');
      this.ss.setChatManifest(cleanManifest);
      this.ss.feed_manifests.push(cleanManifest);
      this.identities.push(cleanManifest);

      this.updateChannel();
    });
  }

  addUser() {
    this.values['newUser'].replace(/\W/g, '');
    if ((this.values['newUser'] as string).substr(0, 2) === '0x') {
      this.values['newUser'] = (this.values['newUser'] as string).substr(2);
    }
    this.identities.push(this.values['newUser'] as string);
    this.ss.feed_manifests.push(JSON.stringify(this.values['newUser']).replace(/[^A-Za-z0-9]/g, ''));
    this.updateChannel();
  }

  updateChannel() {
    const channel = this.generateChannel(this.values['channel'] as string, this.identities);
    console.log('about to upload😻: ', channel);
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

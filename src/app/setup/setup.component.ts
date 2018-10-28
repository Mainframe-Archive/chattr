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
  isNotificationHidden = true;

  address = '02ad4272c7c7ec9a0f79c280f3e82136a832c611';
  path = '/Users/doug/Desktop/swarm_password2';
  channel = 'channel1';
  values = [];
  identities = [];
  manifest_hash = '';

  constructor(public ss: SwarmService) {
    this.values['myAddress'] = '02ad4272c7c7ec9a0f79c280f3e82136a832c611';
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
    this.ss.setGethParams(this.values['path'], this.values['myAddress']);
    this.ss.setOwnersEthAddress(this.values['myAddress'] as string);
    const channel = this.generateChannel(this.values['channel'], []);
    console.log(channel);
    this.ss.createFeedManifest(this.values['channel'] as string).subscribe((manifest: string) => {
      const cleanManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');

      this.ss.setChannelManifest(cleanManifest, this.values['channel'] as string);
      console.log('about to upload:⏰ ', channel);
      this.ss.uploadContent(channel).subscribe((data: {}) => {
        console.log(data);
        const channelMeta: ChattrMeta = {
          bzzaccount: this.values['myAddress'] as string,
          password:  this.values['path'] as string,
          name: this.values['channel'] as string,
          data: '0x' + data as string
        };
        console.log(channelMeta);

        this.ss.updateFeed(channelMeta).subscribe((channel_feed: string) => {
          this.createInitialChatFeed();
        });
      });
    });
  }

  submitJoin() {
    console.log('submit was clicked: ', this.values['myAddress'], this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = false;
    this.isDialogueHidden = true;
    this.isAddHidden = true;
    this.isCreateHidden = true;
    this.isJoinHidden = true;

    this.ss.setGethParams(this.values['path'] as string, this.values['myAddress'] as string);
    this.ss.setOwnersEthAddress(this.values['address'] as string);
    // I need to create my user feed. and provide user 0 with my manifest hash, and subscribe to the channel manifest.
    this.ss.fetchChannelManifest(this.values['channel']).subscribe((manifest: string) => {
      console.log('119: ', manifest);
      this.ss.resolveChannel(manifest).subscribe((channel: any) => {
        console.log('channel: before parse: ', channel);
        console.log('channel: before parse: ', channel.payload.name);
        const channelManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');

        this.ss.setChannelManifest(channelManifest, this.values['channel']);
        this.ss.createInitalChatManifest().subscribe((chat_manifest: string) => {
          const cleanManifest = JSON.stringify(chat_manifest).replace(/[^A-Za-z0-9]/g, '');
          this.manifest_hash = cleanManifest;
          this.isNotificationHidden = false;
          this.ss.setChatManifest(cleanManifest);
          // this.ss.feed_manifests.push(cleanManifest);
          // if ( channel.payload.identities.length < 1 ) { return; }
          // channel.payload.identities.forEach((id: string) => {
          //   this.ss.feed_manifests.push(id);
          // });
        });
      });
    });

  }

  createInitialChatFeed() {
    this.ss.createInitalChatManifest().subscribe((manifest: string) => {
      const cleanManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');
      this.ss.setChatManifest(cleanManifest);
      // this.ss.feed_manifests.push(cleanManifest);
      console.log('🏁🏁🏁🏁 adding an identity: ', cleanManifest);
      this.identities.push(cleanManifest);

      this.updateChannel();
    });
  }

  addUser() {
    this.values['newUser'] = JSON.stringify(this.values['newUser']).replace(/\W/g, '');
    if ((this.values['newUser'] as string).substr(0, 2) === '0x') {
      this.values['newUser'] = (this.values['newUser'] as string).substr(2);
    }
    this.identities.push(this.values['newUser'] as string);
    console.log('🏁🏁🏁🏁 adding an identity2: ', this.values['newUser']);

    // this.ss.feed_manifests.push(JSON.stringify(this.values['newUser']).replace(/[^A-Za-z0-9]/g, ''));
    this.updateChannel();
  }

  updateChannel() {
    const channel = this.generateChannel(this.values['channel'] as string, this.identities);
    console.log('about to upload😻: ', channel);
    this.ss.uploadContent(channel).subscribe((data: string) => {
      console.log('🔋😻🔋😻🔋 uploaded hash: ', data);
      this.ss.updateChannelIdentities(data).subscribe((result: string) => {
        console.log('🔋😻: ', result);
      });
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

  toggleHideNotification() {
    this.isNotificationHidden = !this.isNotificationHidden;
  }

}

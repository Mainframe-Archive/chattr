import { Component, OnInit } from '@angular/core';
import {SwarmService} from '../services/swarm.service';
import { Channel, ChattrMeta } from '../interface/channel';


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
    this.values[key] = value;
  }

  submitCreate() {
    this.ss.user_type_is_creator = true;
    console.log('submit was clicked: ', this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = false;
    this.isDialogueHidden = true;
    this.isAddHidden = false;
    this.isCreateHidden = true;
    this.ss.setGethParams(this.values['path'], this.values['myAddress']);
    this.ss.setOwnersEthAddress(this.values['myAddress'] as string);
    this.ss.createFeedManifest(this.values['channel'] as string).subscribe((manifest: string) => {
      const cleanManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');

      this.ss.setChannelManifest(cleanManifest, this.values['channel'] as string);
      const channel = this.generateChannel(this.values['channel'], cleanManifest, []);
      this.ss.uploadContent(channel).subscribe((data: {}) => {
        const channelMeta: ChattrMeta = {
          bzzaccount: this.values['myAddress'] as string,
          password:  this.values['path'] as string,
          name: this.values['channel'] as string,
          data: '0x' + data as string
        };

        this.ss.updateFeed(channelMeta).subscribe((channel_feed: string) => {
          this.createInitialChatFeed();
        });
      });
    });
  }

  submitJoin() {
    if (this.values['myAddress'] === '02ad4272c7c7ec9a0f79c280f3e82136a832c611') {
      this.values['myAddress'] = '0c6adf0c9518c33b56d39e1193150ad2dcbe1488';
      this.values['path'] = '/Users/doug/Desktop/swarm_password';
    }
    console.log('submit was clicked: ', this.values['myAddress'], this.values['address'], this.values['path'], this.values['channel']);

    this.isChatHidden = false;
    this.isDialogueHidden = true;
    this.isAddHidden = true;
    this.isCreateHidden = true;
    this.isJoinHidden = true;

    this.ss.setGethParams(this.values['path'] as string, this.values['myAddress'] as string);
    this.ss.setOwnersEthAddress(this.values['address'] as string);
    this.ss.fetchChannelFromName(this.values['channel']).subscribe((manifest: string) => {
      this.ss.resolveChannel(manifest).subscribe((channel: any) => {
        const channelManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');

        if (channel.previous_event_pointer && channel.previous_event_pointer !== '') {
          this.ss.setChannelManifest(channel.previous_event_pointer, this.values['channel']);
        } else {
          this.ss.setChannelManifest(channelManifest, this.values['channel']);
        }
        this.ss.createInitalChatManifest().subscribe((chat_manifest: string) => {
          const cleanManifest = JSON.stringify(chat_manifest).replace(/[^A-Za-z0-9]/g, '');
          this.manifest_hash = cleanManifest;
          this.isNotificationHidden = false;
          this.ss.setChatManifest(cleanManifest);
        });
      });
    });

  }

  createInitialChatFeed() {
    this.ss.createInitalChatManifest().subscribe((manifest: string) => {
      const cleanManifest = JSON.stringify(manifest).replace(/[^A-Za-z0-9]/g, '');
      this.ss.setChatManifest(cleanManifest);
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
    this.updateChannel();
  }

  updateChannel() {
    const channel = this.generateChannel(this.values['channel'] as string, this.ss._channel_manifest, this.identities);
    this.ss.uploadContent(channel).subscribe((data: string) => {
      this.ss.updateChannelIdentities(data).subscribe((result: string) => {
      });
    });
  }

  generateChannel(name: string, manifest_hash: string, identities: string[]) {
    const channel: Channel = {
      protocol: 'swarmchat/v0.1',
      utc_timestamp: Date.now() / 1000,
      previous_event_pointer: manifest_hash, // TODO: implement previous_event_pointer
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

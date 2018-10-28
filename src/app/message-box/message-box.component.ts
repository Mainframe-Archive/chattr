import { Component, OnInit } from '@angular/core';
import {Message} from '../message/Message';
import {SwarmService} from '../services/swarm.service';
import { Chat } from '../interface/chat';
import {interval, Observable} from 'rxjs';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  hidden = false;
  messages = [];
  last_manifest_hashes = [];
  // messageData = [{user: 'doug', date: 'today', text: 'Hello World! 👋'}];
  sorted_messages: Message[] = [];
  all_messages: Message[] = [];
  interval = 10000;

  constructor(public ss: SwarmService) {
    // const message = new Message();
    // message.user = 'doug';
    // message.date = ' 5:41 PM';
    // message.date = ' 5:41 PM';
    // message.text = 'Hello World! 👋'
    // this.messages.push(message);
  }

  ngOnInit() {
   interval(this.interval).subscribe((next) => {
     if (!this.ss._channel_manifest ) { return; }
       if ( !this.ss.user_type_is_creator) {
       console.log('1135: ', this.ss._channel_manifest, this.ss._channel_name);
       this.ss.fetchChannelFromName('').subscribe((channel_hash: any) => {
         if ( !channel_hash ) { return; }
         this.ss.resolveChannel(channel_hash).subscribe((channel: any) => {
           if ( channel.payload.identities.length !== this.ss.feed_manifests.length ) {
             this.ss.feed_manifests = channel.payload.identities;
           }
         });
       });
     } else {
       this.ss.fetchChannelFromHash(this.ss._channel_manifest).subscribe((channel_hash: any) => {
         if (!channel_hash) {
           return;
         }
         this.ss.resolveChannel(channel_hash).subscribe((channel: any) => {
           if (channel.payload.identities.length !== this.ss.feed_manifests.length) {
             this.ss.feed_manifests = channel.payload.identities;
           }
         });
       });
     }


     console.log('checking if I should poll for manifest.');
     if (this.ss.feed_manifests.length > 0) {
        this.ss.feed_manifests.forEach((manifest) => {
          this.pollForMessage(manifest);
          console.log('polling for manifest: ', manifest);
        });
      }
    });
  }

  pollForMessage(manifest_hash: string) {
    this.ss.fetchChat(manifest_hash).subscribe((content_hash: string) => {
      if (manifest_hash === this.last_manifest_hashes[content_hash] as string) { return; }
      this.last_manifest_hashes[content_hash] = manifest_hash;
      console.log('47: ', content_hash);
      this.ss.resolveChat(content_hash).subscribe((chat: Chat) => {
        this.processChatPoll(manifest_hash, chat);
      });
    });
  }

  processChatPoll(manifest_hash: string, chat: Chat) {
    // check if the hash has changed.
    const message = new Message();
    message.user = manifest_hash.substr(manifest_hash.length - 6);
    message.date = chat.utc_timestamp;
    message.text = chat.payload.body;

    this.all_messages.push(message);
    this.sorted_messages = this.all_messages.sort(function(a, b) {
      return a.date - b.date;
    });

    this.messages = this.sorted_messages;
    console.log(this.all_messages);
  }

}

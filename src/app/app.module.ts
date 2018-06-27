import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IdentityComponent } from './identity/identity.component';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { MessageComponent } from './message/message.component';
import { MessageInputComponent } from './message-input/message-input.component';


@NgModule({
  declarations: [
    AppComponent,
    IdentityComponent,
    ChannelMembersComponent,
    MessageBoxComponent,
    MessageComponent,
    MessageInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

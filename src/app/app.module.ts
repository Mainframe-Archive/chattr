import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IdentityComponent } from './identity/identity.component';
import { ChannelMembersComponent } from './channel-members/channel-members.component';


@NgModule({
  declarations: [
    AppComponent,
    IdentityComponent,
    ChannelMembersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import {SwarmService} from '../services/swarm.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css']
})
export class IdentityComponent implements OnInit {

  userName = '';
  isHidden = false;
  networkName: string = null;
  usingRopsten: boolean;
  notificationColor: string = null;
  hideNotification = false;

  constructor(ss: SwarmService) {
    ss.getNetworkName().then(name => this.networkName = name);
    ss.getNetworkID().then((netID) => this.setNotificationColor(netID));
  }

  private checkForRopsten(netID: number): boolean {
    return netID === 3;
  }

  ngOnInit() {
  }

  private setNotificationColor(netID: number) {
    this.usingRopsten = this.checkForRopsten(netID);
    let color = 'notification is-danger'
    if (this.usingRopsten) {
      color = 'notification is-info';
    }
    this.notificationColor = color;
  }

  clickSubmit() {
    console.log(this.userName);
    if (this.userName) {
      this.toggleHidden();
    }
  }

  toggleHidden() {
    this.isHidden = !this.isHidden;
  }

  toggleHideNotification() {
    this.hideNotification = !this.hideNotification;
  }
}

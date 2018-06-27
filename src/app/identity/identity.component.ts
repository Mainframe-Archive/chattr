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


  constructor(ss: SwarmService) { }

  ngOnInit() {
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

}

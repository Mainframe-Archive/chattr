import { Component } from '@angular/core';
import { SwarmService } from './services/swarm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chattr';
  public balance: number;

  constructor(ss: SwarmService) {
    ss.getUserBalance().then(balance => this.balance = balance);
  }
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
// import * as W3 from 'web3';
const Web3 = require('web3'); // tslint:disable-line

declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class SwarmService {

  private _account: string = null;
  private _web3: any;

  networkID: number;
  networkName: string = null;

  constructor() {
    this.setupWeb3();
  }

  private setupWeb3() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      this.getNetworkID().then((netID) => {
        this.verifyRopstenIsActive(netID);
      });
      this.getNetworkName();
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }
  }

  private verifyRopstenIsActive(netId) {
    this.networkID = netId;
    switch (netId) {
      case 1:
        console.log('This is mainnet');
        break;
      case 2:
        console.log('This is the deprecated Morden test network.');
        break;
      case 3:
        console.log('This is the ropsten test network.');
        break;
      case 4:
        console.log('This is the Rinkeby test network.');
        break;
      case 42:
        console.log('This is the Kovan test network.');
        break;
      default:
        console.log('This is an unknown network.');
    }
    if (netId !== 3) {
      alert('Please connect to the Ropsten test network');
    }
  }

  async getNetworkID(): Promise<number> {
    this.networkID = await new Promise((resolve, reject) => {
      this._web3.eth.net.getId().then((netId) => {
        resolve(netId);
      });
    }) as number;
    return Promise.resolve(this.networkID);
  }

  async getNetworkName(): Promise<string> {
    this.networkName = await new Promise((resolve, reject) => {
      this._web3.eth.net.getId().then((netId) => {
        let result: string;
        switch (netId) {
          case 1:
            result = 'Mainnet';
            break;
          case 2:
            result = 'Deprecated Morden test network';
            break;
          case 3:
            result = 'Ropsten test network';
            break;
          case 4:
            result = 'Rinkeby test network';
            break;
          case 42:
            result = 'Kovan test network';
            break;
          default:
            result = 'Unknown network';
        }
        resolve(result);
      });
    }) as string;
    return Promise.resolve(this.networkName);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        });
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      // resolve(_web3.eth.getBalance(account).toNumber());
      resolve(3);
      // this._tokenContract.balanceOf.call(account, function (err, result) {
      //   if(err != null) {
      //     reject(err);
      //   }
      //
      //   resolve(_web3.fromWei(result));
      // });
    }) as Promise<number>;
  }
}

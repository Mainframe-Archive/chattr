import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {ChattrMeta} from '../interface/channel';

const Web3 = require('web3'); // tslint:disable-line

const endpoint = 'http://localhost:8500/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class SwarmService {

  private _account: string = null;
  private _web3: any;
  private _path: string;
  private _eth_account: string;
  private _channel_manifest: string;
  private _channel_name: string;
  private _chat_manifest: string;

  networkID: number;
  networkName: string = null;

  constructor(private http: HttpClient) {
    this.setupWeb3();
  }

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }

  setGethParams(path: string, account: string) {
    this._path = path;
    this._eth_account = account;
  }

  setChannelManifest(channel_manifest: string, channel_name: string) {
    this._channel_manifest = channel_manifest;
    this._channel_name = channel_name;
  }

  setChatManifest(chat_manifest: string) {
    this._chat_manifest = chat_manifest;
  }

  getChannel(hash: string): Observable<any> {
    return this.http.get(endpoint + 'bzz:/' + hash + '/').pipe(
      map(this.extractData));
  }

  updateFeed(chattrMeta: ChattrMeta): Observable<any> {
    return this.http.post(endpoint + 'doug-feed:/', JSON.stringify(chattrMeta), {responseType: 'text'}).pipe(
      tap(feed => console.log('feed: ', feed)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  updateChannelIdentities(data: string) {
    const channelMeta: ChattrMeta = {
      bzzaccount: this._eth_account,
      password:  this._path,
      name: this._channel_name,
      data: '0x' + data as string
    };
    return this.http.post(endpoint + 'doug-feed:/', JSON.stringify(channelMeta), {responseType: 'text'}).pipe(
      tap(channel_feed => console.log('channel_feed: ', channel_feed)),
      catchError(this.handleError<any>('updateChannelIdentities'))
    );
  }

  updateChat(data: string) {
    if (this._eth_account.length < 1) { console.error('eth_account was not initialized!'); }
    const chattrMeta: ChattrMeta = {
      bzzaccount: this._eth_account,
      password:  this._path,
      name: this._channel_name,
      data: '0x' + data as string
    };
    return this.http.post(endpoint + 'doug-feed:/', JSON.stringify(chattrMeta), {responseType: 'text'}).pipe(
      tap(feed => console.log('feed: ', feed)),
      catchError(this.handleError<any>('updateChannelIdentities'))
    );
  }

  createInitalChatManifest() {
    if (this._channel_manifest.length < 32) { console.error('channel_mainifest has less than 32 chars.'); }
    return this.createFeedManifest(this._channel_manifest.substring(0, 32));
  }

  createFeedManifest(name: string): Observable<any> {
    return this.http.post(endpoint + `bzz-feed:/?user=${this._eth_account}&name=${name}&manifest=1`, '', {responseType: 'text'}).pipe(
      tap(manifest_feed => console.log('manifest_feed: ', manifest_feed)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  createChannel(channel: string) {
    return this.http.post(endpoint + 'doug-feed:/', JSON.stringify(channel)).pipe(
      tap(_ => console.log(`updated channel hash=${channel}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  uploadContent(content: string): Observable<any> {
    return this.http.post(endpoint + 'bzz:/', content, {responseType: 'text'}).pipe(
      tap(_ => console.log(`uploaded content`)),
      catchError(this.handleError<any>('uploadContent'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private setupWeb3() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      this.getNetworkID().then((netID) => {
        // this.verifyRopstenIsActive(netID);
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
      // alert('Please connect to the Ropsten test network.');
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

  public async getAccount(): Promise<string> {
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

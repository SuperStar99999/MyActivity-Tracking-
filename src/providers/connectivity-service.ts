import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
 
declare var Connection;
 
@Injectable()
export class ConnectivityService {
 
  onDevice: boolean;
 
  constructor(public netwk:Network, public platform: Platform){
    
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    console.log("here");
    console.log(this.netwk.type);
    
    if(this.onDevice && this.netwk.type){
      return this.netwk.type !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && this.netwk.type){
      return this.netwk.type === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
}
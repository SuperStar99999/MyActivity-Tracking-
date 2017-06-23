import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FileProvider } from '../../providers/file-provider/file-provider';
import { PlayerProvider } from '../../providers/player-provider/player-provider';
import { UtilProvider } from '../../providers/util-provider/util-provider';
declare var window:any;

/*
  Generated class for the Browser page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-browser',
  templateUrl: 'browser.html'
})
export class BrowserPage {
  file:string;
  path:string;
  files:any;
  storage = new Storage();
  nativepath: string;


  constructor(public navCtrl: NavController,
    public nav:NavController, 
    public fp:FileProvider, 
    public player: PlayerProvider, 
    public platform: Platform, 
    public params: NavParams, 
    public util:UtilProvider,
    public navParams: NavParams) {
      this.path = params.get('path');   
      platform.ready()
      .then(() => {
        let loader = this.util.getLoader();
        loader.present();
        this.fp.getEntries(this.path)
        .then(content => {
          this.files = content;
          loader.dismiss();
        })
        .catch(error => {
          console.log("File system error", error);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowserPage');
  }

    //  open(file) {
  //   this.file = file;
  //   this.storage.set('current', JSON.stringify({file:file, type:"single"}));
  //   this.player.play(file.nativeURL, false);
  //   // this.nav.push(PlayerPage, {type:'single'});
  // }
  openDocument(file) {
    this.nav.push(BrowserPage, {path: file.nativeURL}, {animate: true});
  }
  // openVideo(file) {
  //   let url = file.nativeURL;
  //   let options = {
  //     successCallback: function() {
  //       console.log("Video was closed without error.");
  //     },
  //     errorCallback: function(errMsg) {
  //       console.log("Error! " + errMsg);
  //     },
  //     orientation: 'landscape'
  //   };
  //   window.plugins.streamingMedia.playVideo(url,options);
  // }

  addToPlaylist(file) {
    console.log(file)
    let value = this.player.addToPlayList(file);
    let message;
    if(value === -1) {
      message = "Track is Already in Playlist."
    } else {
      message = "Track is Added to Playlist";
    }

    let toast = this.util.getToast(message);
    toast.present();
  }

  isAudio(file) {
    let ext = file.name.split(".").pop();
    return this.player.isAudio(ext);
  }

  isVideo(file) {
    let ext = file.name.split(".").pop();
    return this.player.isVideo(ext);
  }

}

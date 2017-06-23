import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { FileChooser } from 'ionic-native';
import { BrowserPage } from '../browser/browser';

import { Storage } from '@ionic/storage';
import { PlayerProvider } from '../../providers/player-provider/player-provider';
/*
  Generated class for the Music page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-music',
  templateUrl: 'music.html'
})
export class MusicPage {
  playlist: any = {};
  storage = new Storage();
  isStart = true;
  isPlaying: Boolean;
  isRepeat: Boolean;
  isShuffle: Boolean;
  currentIndex = 0;
  isEmpty = true;
  zone: any;
  title: any;
  current: any;
  total: any;
  progressbar = 0;

  constructor(public navCtrl: NavController,
    public player: PlayerProvider,
    public nav: NavController,
    public navParams: NavParams) {
    this.isShuffle = false;
    this.isRepeat = true;
    this.isPlaying = false;
    this.current = '00:00';
    this.total = '00:00';
    this.zone = new NgZone({ enableLongStackTrace: false });
  }
  ionViewWillEnter() {

    this.updateTimer();

    this.isShuffle = this.player.isShuffle;
    this.isRepeat = this.player.isRepeat;
    this.isPlaying = this.player.isPlaying;
    this.storage.get('playlist')
      .then(playlist => {
        console.log(playlist);
        if (playlist) {
          this.playlist = JSON.parse(playlist);
          if (this.playlist.tracks.length > 0) {
            this.zone.run(() => {
              this.isEmpty = false;
            });
          }
          else {
            this.zone.run(() => {
              this.isEmpty = true;
            });
          }
          console.log(this.playlist);
        }
      });
  }

  updateTimer() {
    // console.log("Timer");
    if ((this.player.isPlaying) &&(this.player.totalduration!=-1)) {
      let current = this.player.duration;
      let total = this.player.totalduration;
      this.title = this.player.currenttitle;
      console.log("TimeronMusic");
      console.log(current);
      console.log(total);
      //------------------Current Durations--------------
      if(Math.floor(current / 60) < 10)
      {
        this.current = "0" + Math.floor(current / 60) + ":";  
      }
      else{
        this.current = "" + Math.floor(current / 60) + ":"; 
      }
      if(Math.round(current % 60) < 10)
      {
        this.current += "0" + Math.round(current % 60);
      }
      else{
        this.current += "" + Math.round(current % 60);
      }

      //------------------Total Durations--------------
      if(Math.floor(total / 60) < 10)
      {
        this.total = "0" + Math.floor(total / 60) + ":";  
      }
      else{
        this.total = "" + Math.floor(total / 60) + ":"; 
      }
      if(Math.round(total % 60) < 10)
      {
        this.total += "0" + Math.round(total % 60);
      }
      else{
        this.total += "" + Math.round(total % 60);
      }
      this.progressbar = 500*current/total;
    }
    setTimeout(() => {
      this.updateTimer();
    }, 500);
  }

  play() {
    if (this.isPlaying) {
      this.player.pause();
    }
    else {
      if (this.isStart) {
        this.player.startPlaylist();
        this.isStart = false;
      }
      else {
        this.player.play();
      }
    }
    this.isPlaying = !this.isPlaying;
  }

  changeShuffle() {
    this.isShuffle = !this.isShuffle;
    this.player.isShuffle = this.isShuffle;
  }

  changeRepeat() {
    this.isRepeat = !this.isRepeat;
    this.player.isRepeat = this.isRepeat;
  }

  nextTrack() {
    this.player.next();
    this.isPlaying = this.player.isPlaying;
  }

  prevTrack() {
    this.player.back();
    this.isPlaying = this.player.isPlaying;
  }

  gotoSeek(){
    this.player.seekTo(this.progressbar * this.player.totalduration /500);
  }
  deleteTrack(index) {
    this.zone.run(() => {
      this.playlist.tracks.splice(index, 1);
    });
    this.player.deleteTrack(this.playlist);
    if (this.playlist.tracks.length > 0) {
      this.zone.run(() => {
        this.isEmpty = false;
      });
    }
    else {
      this.zone.run(() => {
        this.isEmpty = true;
      });
    }
  }

  gotoBrowser() {
    this.navCtrl.push(BrowserPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPage');
  }

  // filechooser() {
  //     FileChooser.open()
  //   .then(uri => {
  //     (<any>window).FilePath.resolveNativePath(uri, (result) => {
  //       this.nativepath = result;
  //       this.audioplay();
  //     }, (err) => {
  //       alert(err);
  //     })

  //   }) 
  //   .catch(e => console.log(e));
  //   }

  //  audioplay() {
  //   let pathalone = this.nativepath.substring(8);
  //   console.log(pathalone);
  // this._audioProvider.play(pathalone);
  // this.file = new MediaPlugin(pathalone);
  // this.file.play();
  // }
}

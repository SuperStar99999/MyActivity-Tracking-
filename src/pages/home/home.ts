import { Component } from '@angular/core';
import { NavController, Platform,MenuController, Nav } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { ActivityPage } from '../activity/activity';
import { FavorlistPage } from '../favorlist/favorlist';
import { MusicPage } from '../music/music';
import { SensorPage } from '../sensor/sensor';
import { Users } from '../../providers/providers';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  userProfile: any;
  sensor: any;
  type_index = 0;
  favorList: any;
  constructor(
    public navCtrl: NavController,
    public nav: Nav,
    public users: Users,
     public platform: Platform,
    public menuCtrl: MenuController) {
    this.favorList = ["Hello", "Hello2", "Hello3", "Hello4", "Hello5"];
    // this.userProfile = this.users.getCurrentUser();
    this.menuCtrl.enable(true, 'mainmenu');
    this.sensor = null;
  }

  ngAfterViewInit() {    //Get Sensor info from firebase and connect if not null
    this.users.getUser().subscribe((profile) => {
      this.userProfile = profile;
      this.favorList = this.userProfile.favor;
      if(this.favorList.length == 0){
        this.favorList.push("Add Favorite Activity");
      }
      console.log(this.userProfile);
    });
    }
 
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {

  }

  startActivity(type: any) {
    console.log(type);
    this.nav.push(ActivityPage, {
      type: this.type_index
    });
  }
  gotoSensor() {
    this.navCtrl.push(SensorPage);
  }
  gotoMusic() {
    this.navCtrl.push(MusicPage);
  }
  slideChanged() {
    this.type_index = this.slides.getActiveIndex();
  }
  gotoFavorlist(){
    this.navCtrl.push(FavorlistPage);
  }
}

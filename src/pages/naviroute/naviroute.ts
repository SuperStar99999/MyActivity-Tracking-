import { Component } from '@angular/core';
import { NavController, NavParams,Nav, LoadingController, Loading } from 'ionic-angular';
import { NavigatorPage } from '../navigator/navigator';
import { Activities } from '../../providers/activities';
import { Users } from '../../providers/users';
/*
  Generated class for the Naviroute page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-naviroute',
  templateUrl: 'naviroute.html',

})
export class NaviroutePage {
  allActivities: any;
  sortKey = "time";
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav,
    public loadingCtrl: LoadingController,
    public activitise: Activities,
    public users: Users) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Activities...'
    });
    this.loading.present();
    this.getActivities();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NaviroutePage');
  }

  getActivities() {
    this.activitise.getAll(this.users.uid).subscribe(activities => {
      this.allActivities = activities;
      console.log(this.allActivities);
      this.loading.dismiss();
    });
  }
  navigate(activity: any) {
    this.nav.push(NavigatorPage, {
      activity: activity.tracking
    });
    console.log(activity);
  }
  sortbyCity() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Activities...'
    });
    this.loading.present();
    this.sortKey = "time";
  }

  sortbyDuration() {
    this.sortKey = "time";
  }
}

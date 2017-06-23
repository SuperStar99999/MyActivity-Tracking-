import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Users } from '../../providers/users';
/*
  Generated class for the Favorite page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html'
})
export class FavoritePage {
  userProfile:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public users: Users) {
    this.userProfile = this,users.getCurrentUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritePage');
  }

}

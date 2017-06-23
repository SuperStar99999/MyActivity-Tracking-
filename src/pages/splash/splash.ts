import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { MainPage } from '../../pages/pages';

import { Users } from '../../providers/providers';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public platform: Platform,
    public users: Users
    )
  {
    this.menuCtrl.enable(false, 'mainmenu');
    console.log("constructor");
  }
// Load map only after view is initialized
  ionViewDidLoad() {
    setTimeout(() => {
      this.startApp();
    }, 3000);
  }
  startApp() {
    console.log("startApp");
    this.users.getLoggedInUser().subscribe((user) => {
      console.log("getLoggedInUser");
      if (user == null) {
        return this.gotoWelcomePage();
      }
      this.users.setLoggedInUser(user.uid);
      switch (user.provider) {
        case 4:
          if (!user.auth.emailVerified) {
            return this.gotoWelcomePage();
          }
        default:
          this.gotoMainPage();
          break;
      }
    }).unsubscribe();
  }
  gotoWelcomePage() {
    this.navCtrl.setRoot(WelcomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
  gotoMainPage() {
    this.navCtrl.setRoot(MainPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
}
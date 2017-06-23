import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { ForgotPage } from '../forgot/forgot';
import { Users } from '../../providers/providers';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: 'rose91719@gmail.com',
    password: '123456'
  };
  constructor(public navCtrl: NavController,
              public users: Users,
              public toastCtrl: ToastController
              ) {

  }

  // Attempt to login in through our User service
  login() {
    // this.navCtrl.setRoot(MainPage);
    this.users.login(this.account).then((resp) => {
      this.users.setLoggedInUser(resp.uid);
      this.navCtrl.setRoot(MainPage, {}, {
          animate: true,
          direction: 'forward'
      });
    }, (err) => {
      this.showToast(err.message);
    });
  }
  resetPassword() {
    this.navCtrl.push(ForgotPage);
  }
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
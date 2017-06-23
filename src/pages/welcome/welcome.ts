import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { SelectLoginPage } from '../select-login/select-login';
import { SignupPage } from '../signup/signup';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        ) {
            
    }

    ionViewDidLoad() {

    }

    signup() {
        this.navCtrl.push(SignupPage);
    }
    login(response) {
        this.navCtrl.push(SelectLoginPage);
    }
    showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 6000,
            position: 'top'
        });
        toast.present();
    }

}

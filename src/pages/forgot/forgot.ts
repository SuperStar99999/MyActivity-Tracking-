import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { Users } from '../../providers/providers';

/*
  Generated class for the Forgot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html'
})
export class ForgotPage {
  email = "";
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public users: Users) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }
  sendMail() {
    this.users.resetPassword(this.email).then(res => {
      this.showToast('Password reset mail has been sent.')
    }).catch(err => {
      this.showToast(err.message);
    });
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

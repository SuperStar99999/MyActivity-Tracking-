import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MainPage } from '../../pages/pages';
import { Users } from '../../providers/providers';
import { Facebook } from 'ionic-native';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'page-select-login',
  templateUrl: 'select-login.html'
})
export class SelectLoginPage {
    constructor(
            public navCtrl: NavController,
            public navParams: NavParams,
            public toastCtrl: ToastController,
            public af: AngularFire,
            public platform: Platform,
            public users: Users
            ) {
        
    }
    login() {
        this.navCtrl.push(LoginPage);
    }
    onFBSignup() {
        if (!this.platform.is('cordova')) {
            this.users.fbLoginWeb().then(resp => {
                this.addFacebookUser(resp);
            }).catch(err => {
                this.showToast(err.message);
            });
        } else {
            Facebook.login(['email']).then((_response) => {
                this.fbLogin(_response);
            }).catch((err) => {
                this.showToast(err.message);
            })
        }
    }
    addFacebookUser(resp) {
        const relative = this.af.database.object('/users/' + resp.uid);
        let ref = relative.subscribe(data => {
            ref.unsubscribe();
            if (data.$value != null) {
                return;
            }
            relative.set({
                gender: 0,
                height: 180,
                weight: 70,
                avatar: resp.auth.photoURL,
                address:"",
                sensor:{
                    id:"",
                    name:""
                },
                favor: ["Running","Walking","Cycling","Swimming","Jogging"],
                provider: {
                    email: resp.auth.email,
                    providerId: resp.auth.providerId,
                    uid: resp.auth.uid
                }
            })
            this.users.setLoggedInUser(resp.uid);
            this.navCtrl.setRoot(MainPage, {}, {
                animate: true,
                direction: 'forward'
            });
        })
    }
    fbLogin(res) {
        this.users.fbLogin(res).then((resp) => {
            this.addFacebookUser(resp);
        })
        .catch((err) => {
            this.showToast(err.message);
        })
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
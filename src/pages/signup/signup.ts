import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { WelcomePage } from '../welcome/welcome';
import { MainPage } from '../../pages/pages';

import { Users } from '../../providers/providers';
import { AngularFire } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Facebook } from 'ionic-native';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Injectable()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: { email: string, password: string } = {
        email: 'rose91719@gmail.com',
        password: '123456'
    };

    // Our translated text strings

    constructor(public navCtrl: NavController,
        public users: Users,
        public platform: Platform,
        public toastCtrl: ToastController,
        public af: AngularFire,
        public translateService: TranslateService) {
    }

    doSignup() {
        this.users.signup(this.account).then((resp) => {
            this.af.auth.getAuth().auth.sendEmailVerification();
            this.users.setLoggedInUser(resp.uid);
            const relative = this.af.database.object('/users/' + resp.uid);
            relative.set({
                gender: 0,
                height: 180,
                weight: 70,
                avatar: "",
                address: "",
                sensor: {
                    id: "",
                    name: ""
                },
                favor: ["Running","Walking","Cycling","Swimming","Jogging"],
                provider: {
                    email: resp.auth.email,
                    providerId: 'password',
                    uid: resp.auth.email
                }
            })
            this.showToast('Please Verify Your Email');
            this.navCtrl.push(WelcomePage);
        }, (err) => {
            this.showToast(err.message);
        });
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
                address: "",
                sensor: {
                    id: "",
                    name: ""
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
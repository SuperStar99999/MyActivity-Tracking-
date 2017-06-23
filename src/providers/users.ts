import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class Users {
  _user: any;
  uid: string;
  currentUser: any;
  currentUserSub: any;
  db: firebase.database.Database;
  constructor(
    public af: AngularFire) {
      this.db = firebase.database();
  }

  fbLogin(_response) {
    let creds = firebase.auth.FacebookAuthProvider.credential(_response.authResponse.accessToken)
    let providerConfig = {
        provider: AuthProviders.Facebook,
        method: AuthMethods.OAuthToken,
        remember: 'default',
        scope: ['email'],
    };
    return this.af.auth.login(creds, providerConfig);
  }
  fbLoginWeb() {
    return this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    })
  }
  login(accountInfo: any) {
    return this.af.auth.login({
      email: accountInfo.email,
      password: accountInfo.password
    }, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
  }
  getLoggedInUser() {
    return this.af.auth;
  }
  setLoggedInUser(uid) {
    this.uid = uid;
    this.currentUserSub = this.af.database.object('/users/' + uid).subscribe((profile) => {
      this.currentUser = profile;
      console.log(this.currentUser);
    });
  }
  resetPassword(email) {
    return firebase.auth().sendPasswordResetEmail(email)
  }

  signup(accountInfo: any) {
    return this.af.auth.createUser({email: accountInfo.email, password: accountInfo.password});
  }

  logout() {
    this.currentUserSub.unsubscribe();
    return this.af.auth.logout(); 
  }

  updateProfile(profile) {
    // this.billList.update(billId, { paid: true });
    var userRef = this.db.ref('/users/' + this.uid);
    delete profile.$exists;
    delete profile.$key;
    userRef.update(profile).then(res => console.log(res));
    return true;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  getUser(){
    return this.af.database.object('/users/' + this.uid);
  }
}
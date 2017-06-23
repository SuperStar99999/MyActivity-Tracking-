import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Nav} from 'ionic-angular';
import { Users } from '../../providers/providers';
import { WelcomePage } from '../../pages/welcome/welcome';


import * as firebase from 'firebase';
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  userProfile: any;
  avatarImage: string;
  filePath: any;
  avatarRef: firebase.storage.Reference;
  mode = 0;
  constructor(
    public navCtrl: NavController,
    public nav: Nav,
    public navParams: NavParams,
    public users: Users,
    public alertCtrl: AlertController
  ) {
    this.userProfile = this.users.getCurrentUser();
    this.avatarImage = this.userProfile.avatar;
    console.log(this.userProfile);    
  }

  ionViewDidLoad() {
    
  }
  logout() {
    this.users.logout();
    this.gotoHomePage()
  }
  gotoHomePage() {
    this.nav.setRoot(WelcomePage);
  }

  avatarChange(image: any) {
    this.filePath = image.files[0];
    this.readFiles(image.files, (result: any) => {
      this.avatarImage = result;
    });
    this.updateProfile(this.filePath);
  }
  readFiles(files: any, callback: any){
    let reader = new FileReader();
    this.readFile(files[0], reader, callback);
  }
  readFile(file: any, reader: any, callback: any) {
    reader.onload = () => {
      callback(reader.result);
    }
    reader.readAsDataURL(file);
  }
  updateProfile(avatar) {
    console.log("updateProfile");
    firebase.storage().ref('/profile/' + this.users.uid + '.png').put(avatar).then(res => {
      this.userProfile.avatar = res.downloadURL;
      this.update();
    })
  }
  update() {
    console.log("update");
    console.log(this.userProfile);
    this.users.updateProfile(this.userProfile);    
  }
  namePrompt() {
    console.log("namePrompt");
    let alert = this.alertCtrl.create({
      title: 'Please Input Name',
      inputs: [
        {
          name: 'displayName',
          placeholder: 'NAME',
          type: 'text',
          value: this.userProfile.displayName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: null
        }, {
          text: 'Change',
          handler: data => {
            this.userProfile.displayName = data.displayName
            // this.update()
          }
        }
      ]
    });
    alert.present();
  }
  weightPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Please Input Weight',
      inputs: [
        {
          name: 'weight',
          placeholder: 'GEWICHT',
          type: 'number',
          value: this.userProfile.weight
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: null
        }, {
          text: 'Change',
          handler: data => {
            this.userProfile.weight = data.weight
            // this.update()
          }
        }
      ]
    });
    alert.present();
  }
  heightPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Please Input Height',
      inputs: [
        {
          name: 'height',
          placeholder: 'GROSSE',
          type: 'number',
          value: this.userProfile.height
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: null
        }, {
          text: 'Change',
          handler: data => {
            this.userProfile.height = data.height
            // this.update()
          }
        }
      ]
    });
    alert.present();
  }
  changeMale() {
    this.userProfile.gender = !this.userProfile.gender;
    // this.update();
  }
  saveprofile(){
    this.update();
    this.navCtrl.pop();
  }
}

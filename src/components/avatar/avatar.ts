import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Users } from '../../providers/providers';

import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'avatar',
  templateUrl: 'avatar.html'
})
export class AvatarComponent {
  constructor(
    public navCtrl: NavController,
    public users: Users
  ) {

  }
  onProfile() {
    this.navCtrl.push(ProfilePage);
  }

}

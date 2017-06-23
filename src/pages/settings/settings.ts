import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(
      public navCtrl: NavController,
      public settings: Settings,
      public formBuilder: FormBuilder,
      public navParams: NavParams) {
    

  }


  ionViewDidLoad() {
  }

  ionViewWillEnter() {

  }

}

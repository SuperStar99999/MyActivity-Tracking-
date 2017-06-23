import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Settings } from '../providers/providers';

import { FirstRunPage } from '../pages/pages';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { Facebook } from 'ionic-native';

@Component({
  template: `<ion-menu [content]="content">
    <ion-content class="menu-bg">
      <ion-list>
        <div text-center>
          <img src="assets/img/logo.png" class="menu-logo">
        </div>
        <button no-lines class="menu-button" color="light" menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <ion-item class="menu-button"></ion-item>
        <ion-item class="menu-button" no-lines (click)="gotoSetting()">
          <img src="assets/icon/Einstellungen_negativ.png" class="item-icon" item-left>
          <button no-lines class="menu-button-sm" color="light" menuClose ion-item>
            HAUPT-EINSTELLUNGEN
          </button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { id: 1, title: 'News', component: TabsPage },
    { id: 2, title: 'Trainingsplan', component: TabsPage },
    { id: 3, title: 'Ernahrungsplan', component: TabsPage },
    { id: 4, title: 'Social Media', component: TabsPage },
    { id: 5, title: 'Bewertung', component: TabsPage },
    { id: 6, title: 'Shop', component: TabsPage },
  ]

  constructor(translate: TranslateService, platform: Platform, settings: Settings, config: Config) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    switch(page.id) {
      case 4:
        Facebook.showDialog({
          method: "share",
          href: "http://example.com",
          caption: "MyActivity24",
          description: "My Activity 24",
          picture: 'http://example.com/image.png'
        });
        break;
      default:
        this.nav.setRoot(page.component);
        break;
    }
  }
  gotoSetting() {
    this.nav.push(SettingsPage);
  }
}
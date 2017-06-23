import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';

import { SplashPage } from '../pages/splash/splash';
import { WelcomePage } from '../pages/welcome/welcome';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SelectLoginPage } from '../pages/select-login/select-login';
import { ForgotPage } from '../pages/forgot/forgot';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { StatisticPage } from '../pages/statistic/statistic';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { ActivityPage } from '../pages/activity/activity';
import { FavoritePage } from '../pages/favorite/favorite';
import { FavorlistPage } from '../pages/favorlist/favorlist';
import { DetailPage } from '../pages/detail/detail';
import { SensorPage } from '../pages/sensor/sensor';
import { MusicPage } from '../pages/music/music';
import { BrowserPage } from '../pages/browser/browser';
import { NaviroutePage } from '../pages/naviroute/naviroute';
import { NavigatorPage } from '../pages/navigator/navigator';

import { GlobalVars, Users, Activities, Settings } from '../providers/providers';
import { FileProvider } from '../providers/file-provider/file-provider';
import { PlayerProvider } from '../providers/player-provider/player-provider';
import { UtilProvider } from '../providers/util-provider/util-provider';
import { ActivityFilter } from '../providers/activity-filter';
import { LocationTracker } from '../providers/location-tracker';
import { ConnectivityService } from '../providers/connectivity-service';

import { AvatarComponent } from '../components/avatar/avatar';

import { HBtnComponent } from '../components/h-btn/h-btn';
import { HBtn3Component } from '../components/h-btn-3/h-btn-3';
import { HItemComponent } from '../components/h-item/h-item';

import { ItemComponent } from '../components/item/item';

import { StatisticListComponent } from '../components/statistic-list/statistic-list';
import { StatisticMonthComponent } from '../components/statistic-month/statistic-month';
import { StatisticOverviewComponent } from '../components/statistic-overview/statistic-overview';
import { StatisticWeekComponent } from '../components/statistic-week/statistic-week';
import { StatisticYearComponent } from '../components/statistic-year/statistic-year';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';


export const firebaseConfig = {
  apiKey: "AIzaSyAeZMRGLWgCY5Q0p7n85uYgEcyG35S0qh0",
  authDomain: "myactivity24-ca60b.firebaseapp.com",
  databaseURL: "https://myactivity24-ca60b.firebaseio.com",
  projectId: "myactivity24-ca60b",
  storageBucket: "myactivity24-ca60b.appspot.com",
  messagingSenderId: "1066301529278"
};

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,

  SplashPage, WelcomePage,

  LoginPage, SignupPage, SelectLoginPage, ForgotPage,
  FavorlistPage,
  TabsPage,
  SettingsPage,
  HomePage,
  StatisticPage,
  ProfilePage,
  ActivityPage,
  DetailPage,
  FavoritePage,
  SensorPage,
  MusicPage,
  BrowserPage,
  NaviroutePage,
  NavigatorPage,
  AvatarComponent, HBtnComponent, HBtn3Component, HItemComponent, ItemComponent,
  StatisticListComponent, StatisticMonthComponent, StatisticOverviewComponent, StatisticWeekComponent, StatisticYearComponent
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Users,
    Activities,
    GlobalVars,
    LocationTracker,
    BackgroundGeolocation,
    ConnectivityService,
    Geolocation,
    DeviceOrientation, 
    Network,
    FileProvider,
    PlayerProvider,
    UtilProvider,
    ActivityFilter,
    // Storage,
    // MediaPlugin,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule { }

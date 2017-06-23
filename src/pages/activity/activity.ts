import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';
import { MainPage } from '../../pages/pages';
import { BLE } from 'ionic-native';
import { AlertController } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { LocationTracker } from '../../providers/location-tracker';
import { ConnectivityService } from '../../providers/connectivity-service';
declare var google: any;

import { Activity } from '../../models/activity';
import { GlobalVars, Activities, Users } from '../../providers/providers';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html'
})
export class ActivityPage {
  @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('directionsPanel') directionsPanel: ElementRef;
  SETTINGS_KEY: string = '_settings';
  zone: any;
  sensor: any;
  userProfile: any;
  time: {
    min: number,
    sec: number,
  } = { min: 0, sec: 0 };
  altitude: number = 0;
  speed = 0.0;
  meanspeed = 0.0;
  topspeed = 0.0;
  minspeed = 10000;
  pace = 0.0;

  kcal = 0.0;
  bpm = -1;
  cal = 0.0;
  city_name: any;
  map: any = null;
  totaldistance = 0.0000;
  polyline: any = null;
  positions = [];
  bpms = [];
  tracking = [];
  marker: any = null;
  loading: Loading;
  // offsetx = 0.000001;
  // offsety = 0.000001;
  flag = 0;
  start: any;
  end: any;
  isActivity = 0;

  bpmsum = 0;
  bpmcount = 0;
  type_id = 0; //Activity Type


  mapInitialised: boolean = false;
  apiKey: "AIzaSyCzUJcimlvlr-xt1EXw-je6cxqS6nbAZA0";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public activities: Activities,
    public users: Users,
    public globalVars: GlobalVars,
    public loadingCtrl: LoadingController,
    public locationTracker: LocationTracker,
    public connectivityService: ConnectivityService,
    private alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.type_id = navParams.get('type');
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.flag = 1;
    this.sensor = null;
    this.city_name = "";
  }
  ngAfterViewInit() {
    this.platform.ready().then(() => this.onPlatformReady());
  }
  private onPlatformReady(): void {
    this.userProfile = this.users.getCurrentUser();
    this.sensor = this.userProfile.sensor;
    this.activieSensor();
    this.locationTracker.startTracking();
    this.loadGoogleMaps();
  }
  loadGoogleMaps() {
    this.addConnectivityListeners();
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();
      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }
        let script = document.createElement("script");
        script.id = "googleMaps";
        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {
      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }
    }
  }
  initMap() {
    this.mapInitialised = true;
    let latLng = new google.maps.LatLng(41.738, 123.433);
    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({ position: new google.maps.LatLng(-34.9290, 138.6010), title: "end" });
    this.marker.setMap(this.map);
    this.polyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#54d400',
      strokeOpacity: 0.75,
      strokeWeight: 3,
      path: []
    })
    this.map.setCenter({ lat: this.locationTracker.lat, lng: this.locationTracker.lng, alt: 0 });
    this.onReady();

  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {
    let onOnline = () => {
      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        } else {
          if (!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    };
    let onOffline = () => {
      this.disableMap();
    };
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  activieSensor() {
    this.sensor = this.userProfile.sensor;
    console.log("Acitive Sensor");
    console.log(this.sensor.name);
    if (this.sensor.name != "")   //If userprofile has a sensor, connect it.
    {
      console.log(this.globalVars.getSensorConnection());
      if (!this.globalVars.getSensorConnection()) {
        BLE.startScan([]).subscribe(device => {     //Scan sensor and list it to the UI
          console.log(device);
          if (device.id == this.sensor.id) {
            BLE.connect(this.sensor.id).subscribe(
              peripheralData => {
                BLE.startNotification(this.sensor.id, "180d", "2a37").subscribe((data) => {
                  this.getBpm(data);
                });
              },
              error => {
                console.log("Error Connecting" + JSON.stringify(error));
              }
            );
          }
        });
      }
      else {
        BLE.startNotification(this.sensor.id, "180d", "2a37").subscribe((data) => {
          this.getBpm(data);
        });
      }
    }
  }
  getBpm(data) {
    this.zone.run(() => {
      let dTemp = new Uint8Array(data);
      console.log(dTemp);
      this.bpm = dTemp[1];
      console.log(this.bpm);
      if (dTemp[2] != null) {
        this.cal = dTemp[2];
      }
    });
  }
  ionViewDidLoad() {
    var listEle = document.getElementById('list');
    var mapEle = document.getElementById('map');
    mapEle.style.height = (mapEle.offsetHeight - listEle.offsetHeight) + 'px';
  }

  dismissLoading() {
    if (this.loading != null) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  updateTimer() {
    this.time.sec++;
    if (this.time.sec >= 60) {
      this.time.sec -= 60;
      this.time.min++;
    }
    setTimeout(() => {
      if (this.flag == 1) {
        this.updateTimer();
      }
    }, 1000);
  }

  onReady() {
    if (this.locationTracker.flag) {
      if (this.time.sec == 0 && this.time.min == 0) {
        this.getCityName();
        this.updateTimer();
      }

      this.altitude = this.locationTracker.alt;
      let location = new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng);
      this.map.setCenter({ lat: this.locationTracker.lat, lng: this.locationTracker.lng, alt: 0 });
      this.marker.setPosition({ lat: this.locationTracker.lat, lng: this.locationTracker.lng, alt: 0 });
      //Add Tracking Data to the array
      this.tracking.push([this.locationTracker.lat, this.locationTracker.lng]);
      this.speed = this.locationTracker.speed * 3600 / 1000; //Calculate speed (Get coordinate every 1 sec so distance = speed)
      if (this.isActivity != 0) {
        this.start = this.end;
        this.end = location;
        let distTemp = this.distance(this.start.lat(), this.start.lng(), this.end.lat(), this.end.lng(), 'K');
        this.totaldistance += distTemp; //Total distance  = sum of every distance
        //Get Top speed
        if (this.speed > this.topspeed) {
          this.topspeed = this.speed;
        }
        //Get Min speed
        if (this.speed != 0) {
          if (this.speed < this.minspeed) {
            this.minspeed = this.speed;
          }
        }
      }
      if (this.isActivity == 0) {
        this.start = location;
        this.end = location;
        this.isActivity++;
      }
      //Update Tracking on GoogleMap
      let poly = this.polyline.getPath();
      poly.push(location);
      this.polyline.setPath(poly);

      //Add Bpm data to the array
      this.bpms.push(this.bpm);
      if (this.bpm! > 0) {
        this.bpmcount++;
        this.bpmsum += this.bpm;
      }
      this.kcal += this.cal * 0.000238;
    }
    setTimeout(() => {
      if (this.flag == 1) {
        this.onReady();
      }
    }, 1000);
  }
  getPace() {
    var time = this.time.min * 60 + this.time.sec;
    // var distance = this.getDistance();
    if (this.totaldistance <= 0) {
      return 0;
    }
    return time / this.totaldistance / 60;
  }
  getDistance() {
    var prevPos: any;
    if (this.positions.length > 1) {
      prevPos = this.positions[0];
      for (var i = 1; i < this.positions.length; i++) {
        var curPos = this.positions[i];
        this.totaldistance += this.distance(prevPos.lat(), prevPos.lng(), curPos.lat(), curPos.lng(), 'K');
        prevPos = curPos;
      }
    }
  }

  // distance(lat1, lon1, lat2, lon2, unit) {
  //   // console.log(lat1 + ":" + lon1 +"=" +lat2 + ":" + lon2 );
  //   var radlat1 = Math.PI * lat1/180
  //   var radlat2 = Math.PI * lat2/180
  //   var theta = lon1-lon2
  //   var radtheta = Math.PI * theta/180
  //   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //   dist = Math.acos(dist)
  //   dist = dist * 180 / Math.PI
  //   dist = dist * 60 * 1.1515
  //   if (unit=="K") { dist = dist * 1.609344 }
  //   if (unit=="N") { dist = dist * 0.8684 }
  //   // console.log(dist);
  //   return dist
  // }

  distance(lat1, lon1, lat2, lon2, unit) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (unit == "K") { R = 6371; }
    if (unit == "N") { R = 3437.7835938; }
    let d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  getCityName() {
    var _self = this;
    this.geoFunc(function (addr) {
      if (addr.length > 1) {
        for (let i = 1; i < addr.length; i++) {
          _self.city_name += addr[i];
        }
      }
      console.log(this);
      console.log("this variable" + _self.city_name);
      console.log(addr);
    });
  }
  geoFunc(callback) {
    let geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng);
    geocoder.geocode(
      { 'latLng': latlng },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let add = results[0].formatted_address;
            let value = add.split(",");
            let count = value.length;
            console.log(value);
            callback(value[count - 4]);
          }
          else {
            // alert("address not found");
          }
        }
        else {
          // alert("Geocoder failed due to: " + status);
        }
      }
    );
  }



  stopActivity() {
    BLE.disconnect(this.sensor.id);
    this.globalVars.setSensorConnection(false);
    this.locationTracker.stopTracking();
    this.flag = 0;
    console.log("City Name Last");
    console.log(this.city_name);
    let alert = this.alertCtrl.create({
      title: 'Confirm Activity',
      message: 'Do you want to SAVE this activity?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.flag = 0;
            this.navCtrl.setRoot(MainPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let activity = new Activity();
            activity.time = this.time.min * 60 + this.time.sec;
            activity.altitude = this.altitude;
            activity.distance = this.totaldistance;
            activity.kcal = this.kcal;
            activity.pace = this.getPace();
            activity.speed = this.speed;
            activity.minspeed = this.minspeed;
            activity.topspeed = this.topspeed;
            activity.city = this.city_name;
            activity.meanspeed = this.totaldistance * 3600 / activity.time;
            activity.tracking = "";
            if (this.bpmcount > 0) {
              activity.bpm = this.bpmsum / this.bpmcount;
            }
            activity.type = this.userProfile.favor[this.type_id];
            this.activities.add(activity, this.users.uid, this.tracking, this.bpms);
            let loading = this.loadingCtrl.create({
              content: 'Saving Data...'
            });
            loading.present();

            setTimeout(() => {
              loading.dismiss();
            }, 5000);

            this.navCtrl.setRoot(MainPage);

          }
        }
      ]
    });
    alert.present();
  }
}
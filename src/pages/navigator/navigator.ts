import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Nav, NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import { ConnectivityService } from '../../providers/connectivity-service';
import { MainPage } from '../../pages/pages';
import { BLE } from 'ionic-native';
import { AlertController } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

declare var google: any;

import { Activity } from '../../models/activity';
import { GlobalVars, Activities, Users } from '../../providers/providers';


@Component({
  selector: 'page-navigator',
  templateUrl: 'navigator.html'
})
export class NavigatorPage {
  @ViewChild('map') mapElement: ElementRef;
  naviActivity: any;
  activityId: string;
  loading: Loading;

  zone: any;
  sensor: any;
  userProfile: any;
  milisec = 0;
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

  city_name = "";
  map: any = null;
  totaldistance = 0.0000;
  polyline: any = null;
  prevpositions = [];
  bpms = [];
  tracking = [];
  marker: any = null;
  type = "";
  // offsetx = 0.000001;
  // offsety = 0.000001;
  prevpolyline: any = null;
  flag = 0;
  start: any;
  end: any;
  isActivity = 0;
  icon: any;

  mapInitialised: boolean = false;
  apiKey: "AIzaSyCzUJcimlvlr-xt1EXw-je6cxqS6nbAZA0";

  constructor(public nav: Nav, public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public platform: Platform,
    public activities: Activities,
    public globalVars: GlobalVars,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public activitise: Activities,
    public users: Users,
    public locationTracker: LocationTracker,
    public connectivityService: ConnectivityService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.loading = this.loadingCtrl.create({
      content: 'Loading Activities...'
    });
    this.loading.present();
    this.activityId = navParams.get('activity');
    this.type = navParams.get("type");
    console.log(this.type);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NaviroutePage');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => this.onPlatformReady());
  }

  private onPlatformReady(): void {

    this.getTracking();
    this.flag = 1;
    this.sensor = null;
    this.userProfile = this.users.getCurrentUser();
    this.activieSensor();
    console.log(this.userProfile);
    this.sensor = this.userProfile.sensor;
  }

  loadGoogleMaps() {

    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      // console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        // console.log("online, loading map");

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
    this.locationTracker.startTracking();
    this.updateDirection();
  }
  initMap() {

    this.mapInitialised = true;
    let latLng = new google.maps.LatLng(this.prevpositions[0][0], this.prevpositions[0][1]);

    let mapOptions = {

      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let markerStart = new google.maps.Marker({ position: latLng, title: "start", icon: "assets/icon/posstart.png" });
    markerStart.setMap(this.map);

    this.map.setCenter({ lat: this.prevpositions[0][0], lng: this.prevpositions[0][1], alt: 0 });

    var posEnd = new google.maps.LatLng(this.prevpositions[this.prevpositions.length - 1][0], this.prevpositions[this.prevpositions.length - 1][1]);
    var markerEnd = new google.maps.Marker({ position: posEnd, title: "end", icon: "assets/icon/posend.png" });
    markerEnd.setMap(this.map);

    // this.marker = this.map.addMarker(new MarkerOptions()
    //   .position(latLng)
    //   .anchor(0.5, 0.5)
    //   .icon("assets/icon/arrow.png")
    //   .rotation(90.0));

    this.icon = {
      // url:"assets/icon/arrow.png"
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      fillColor: "#007EFF",
      fillOpacity: 1,
      strokeWeight: 0,
      anchor: new google.maps.Point(0, 2.6),
      scale: 6,
      rotation: 0
    }

    this.marker = new google.maps.Marker({
      position: latLng,
      title: "start",
      icon: this.icon
    });
    // this.marker.setIcon(this.icon).anchor(0.5,0.5);
    this.marker.setMap(this.map);

    let latlngs = [];
    for (let i = 0; i < this.prevpositions.length; i++) {
      latlngs.push(new google.maps.LatLng(this.prevpositions[i][0], this.prevpositions[i][1]));
    }
    this.prevpolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#54d400',
      strokeOpacity: 0.75,
      strokeWeight: 3,
      path: latlngs
    })

    this.polyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#ff0000',
      strokeOpacity: 0.75,
      strokeWeight: 3,
      path: []
    })

    this.map.setCenter({ lat: latLng.lat, lng: latLng.lng, alt: 0 });
    this.trackMap();
    this.loading.dismiss();
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }
  updateDirection() {
    // this.icon = {
    //   // url:"assets/icon/arrow.png"
    //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //   fillColor: "#007EFF",
    //   fillOpacity: 1,
    //   strokeWeight: 0,
    //   anchor: new google.maps.Point(0, 2.6),
    //   scale: 6,
    //   rotation: this.locationTracker.angle
    // }
    // console.log("angle" + this.locationTracker.angle);
    this.icon.rotation = this.locationTracker.angle;
    this.marker.setIcon(this.icon);
    setTimeout(() => {
      this.updateDirection();
    }, 100);
  }
  updateTimer() {

    {
      this.milisec = 0;
      this.time.sec++;
      if (this.time.sec >= 60) {
        this.time.sec -= 60;
        this.time.min++;
      }
    }
    setTimeout(() => {
      if (this.flag == 1) {
        this.updateTimer();
      }
    }, 1000);
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

  trackMap() {
    if (this.locationTracker.flag) {
      if (this.time.sec == 0 && this.time.min == 0) {
        this.getCityName();
        this.updateTimer();
      }

      // console.log("Tracking");
      // alert(res.coords.speed);

      this.altitude = this.locationTracker.alt;
      let location = new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng);
      this.map.setCenter({ lat: this.locationTracker.lat, lng: this.locationTracker.lng, alt: 0 });
      this.marker.setPosition({ lat: this.locationTracker.lat, lng: this.locationTracker.lng, alt: 0 });
      // this.icon = {
      //   // url:"assets/icon/arrow.png"
      //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      //   fillColor: "#007EFF",
      //   fillOpacity: .6,
      //   strokeWeight: 0,
      //   size: new google.maps.Size(36, 36),
      //   origin: new google.maps.Point(0, 0),
      //   scale: 6,
      //   rotation: this.locationTracker.angle
      // }

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
      this.kcal += this.cal * 0.000238;
    }
    setTimeout(() => {
      if (this.flag == 1) {
        this.trackMap();
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
      // console.log(dTemp);
      this.bpm = dTemp[1];
      // console.log(this.bpm);
      if (dTemp[2] != null) {
        this.cal = dTemp[2];
      }
    });
  }
  getTracking() {
    // console.log(this.activityId, this.users.uid);
    this.activitise.getTracking(this.users.uid + '/' + this.activityId).subscribe(activities => {
      this.naviActivity = activities;
      this.prevpositions = activities[1];
      // delete this.positions.$key;
      // console.log(this.prevpositions[1]);
      this.loadGoogleMaps();
    });
  }

  stopActivity() {
    BLE.disconnect(this.sensor.id);
    this.globalVars.setSensorConnection(false);
    this.locationTracker.stopTracking();
    this.flag = 0;

    let alert = this.alertCtrl.create({
      title: 'Confirm Activity',
      message: 'Do you want to SAVE this activity?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.nav.pop();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let activity = new Activity();
            activity.altitude = this.altitude;
            activity.distance = this.totaldistance;
            activity.kcal = this.kcal;
            activity.pace = this.getPace();
            activity.speed = this.speed;
            activity.minspeed = this.minspeed;
            activity.topspeed = this.topspeed;
            activity.time = this.time.min * 60 + this.time.sec;
            activity.meanspeed = this.totaldistance * 3600 / activity.time;
            activity.tracking = "";// this.tracking;
            activity.type = this.type;
            // activity.bpms = "";//this.bpms;
            activity.city = this.city_name;
            this.activities.add(activity, this.users.uid, this.tracking, this.bpms);
            let loading = this.loadingCtrl.create({
              content: 'Saving Data...'
            });
            loading.present();
            setTimeout(() => {
              loading.dismiss();
            }, 5000);
            this.nav.pop();
          }
        }
      ]
    });
    alert.present();

  }
}

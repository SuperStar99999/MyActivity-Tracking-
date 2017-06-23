import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTracker {
  public compass: any;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public alt: number = 0;
  public speed: number = 0;
  public head: number = 0;
  public flag: boolean = false;
  public angle: number = 0;

  constructor(public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation,
    private deviceOrientation: DeviceOrientation,
    public geolocation: Geolocation) {
  }

  startTracking() {
    // Background Tracking
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 0,
      distanceFilter: 0,
      debug: true,
      interval: 500
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.speed = location.speed;
        this.alt = location.altitude;
        this.head = location.bearing;
        console.log(location.bearing);
        this.flag = true;
      });
    }, (err) => {
      console.log(err);
    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.speed = position.coords.speed;
        this.alt = position.coords.altitude;
        this.head = position.coords.heading;
        console.log(position.coords.heading);
        this.flag = true;
      });
    });

     this.compass = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.zone.run(() => {
          this.angle = data.trueHeading;
          console.log(this.angle);
      });
      }
    );
  }

  stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();
    this.compass.unsubscribe();
    this.flag = false;
  }
}
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { BLE } from 'ionic-native';
import { GlobalVars, Users } from '../../providers/providers';
declare var google: any;

/*
  Generated class for the Sensor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sensor',
  templateUrl: 'sensor.html'
})
export class SensorPage {
  userProfile:any;  //User Profile from firebase
  sensors: any[];   //Sensor list
  sensor:any;       //Connected sensor
  isconnected = false;  //Connection Flag
  scanstatus="No Paired Sensor."  //Status Text
  constructor(public navCtrl: NavController, 
  public platform: Platform,
  public users: Users,
  public globalVars: GlobalVars,
  public loadingCtrl: LoadingController,
  public navParams: NavParams) {
    this.sensor = null; //Init connected sensor = null
  }
  ngAfterViewInit() {    
    this.userProfile = this.users.getCurrentUser(); //Get User profile from firebase
    this.sensor = this.userProfile.sensor;    //Get sensor info from user profile
    console.log(this.sensor.id);
    this.sensors=[];          //Init Sensor List
    if(this.sensor.name != "")   //If userprofile has a sensor, connect it.
    {
      this.scanstatus = "Sensor Paired.";
      this.sensors.push(this.sensor);
      this.isconnected = true;
      BLE.startScan([]).subscribe(device => {     //Scan sensor and list it to the UI
         if(device.id == this.sensor.id)
         {
           BLE.connect(this.sensor.id).subscribe(
            peripheralData => {
              this.scanstatus = "Sensor Connected.";              
              this.globalVars.setSensorConnection(true);
            },
            error => {
              console.log("Error Connecting" + JSON.stringify(error));
            }
          );
         }
      });       
    }     
  }

  scanSensors(){
    this.sensors = [];
    let loader = this.loadingCtrl.create({
      content: "Searching devices nearby...",
      duration: 3000
    });
    loader.present();
    this.scanstatus="Searching Sensors..."
    BLE.startScan([]).subscribe(device => {     //Scan sensor and list it to the UI
      console.log(device);    
      this.sensors.push(device);
      this.scanstatus = this.sensors.length + " Sensors Found.";
    });    
  }

  connectSensor(sensor){
    this.sensor = sensor;       //set connected sensor value to current sensor
    console.log(this.sensor);  
    this.sensors = [];          //init Sensor list
    this.sensors.push(sensor);  //Add only current connected sensor
    this.isconnected = true;    
    BLE.connect(sensor.id).subscribe(
      peripheralData => {
        console.log(peripheralData);
        this.userProfile.sensor.name = this.sensor.name;
        this.userProfile.sensor.id = this.sensor.id;
        this.users.updateProfile(this.userProfile); 
        this.scanstatus="Sensor Connected.";
        this.globalVars.setSensorConnection(true);
      },
      error => {
        console.log("Error Connecting" + JSON.stringify(error));
      }
    );
    BLE.stopScan().then(() => {
    });
  }
  unpair(){
    BLE.disconnect(this.sensor.id);
    this.userProfile.sensor.id = "";
    this.userProfile.sensor.name = "";
    this.users.updateProfile(this.userProfile); 
    console.log(this.sensor);
    this.isconnected = false;
    this.scanstatus="No Paired Sensor."
    this.globalVars.setSensorConnection(false);
    this.scanSensors();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SensorPage');
  }
}

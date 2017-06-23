import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DetailPage } from '../../pages/detail/detail';
import { Chart } from 'chart.js';
import { Activities, Users } from '../../providers/providers';
import { Activity } from '../../models/activity';

declare var google: any;

@Component({
  selector: 'statistic-list',
  templateUrl: 'statistic-list.html'
})
export class StatisticListComponent {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('lineCanvas') lineCanvas;

  activityArray: Activity[] = [];
  totalDistance: number;
  totalTime: number;
  totalKcal: number;
  maxSpeed: number;
  heartRate: number;
  maxHeartRate: number;
  maxAltitude: number;
  data: number[] = [];

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public activitise: Activities,
    public users: Users) {
    platform.ready().then(() => {
      
      this.getValues();
      
    });
  }
  onDetail(index: number) {
    console.log(index);
    this.navCtrl.push(DetailPage);
  }
  getValues() {
    this.activitise.getAll(this.users.uid).subscribe(activities => {
      
      this.totalDistance = 0;
      this.totalTime = 0;
      this.totalKcal = 0;
      this.maxSpeed = 0;
      this.heartRate = 0;//?
      this.maxHeartRate = 0; //?
      this.data = [];
      this.activityArray = [];
      for (let item of activities) {
        let activity: Activity = item;
        this.activityArray.push(activity);
        this.totalDistance = activity.distance;
        this.totalTime = activity.time;
        this.totalKcal = activity.kcal;
        if (activity.speed > this.maxSpeed) {
          this.maxSpeed = activity.speed;
        }
        if (activity.altitude > this.maxAltitude) {
          this.maxAltitude = activity.altitude;
        }
        this.data.push(activity.distance);
      }
      this.loadMap();
      this.loadChart();
    });
  }
  loadChart() {
    var options = {
      type: 'line',
      data: {
        labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
        datasets: [
          {
            label: "AKTIVIAT TOTAL SEIT BEGINN",
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(255, 255, 255, 0)",//
            borderColor: "rgba(253, 148, 109, 1)",//FD946D
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(255, 104, 113, 1)",//
            pointBackgroundColor: "#fff",//
            pointBorderWidth: 1,
            pointHoverRadius: 1,
            pointHoverBackgroundColor: "rgba(255, 255, 255, 0)",//
            pointHoverBorderColor: "rgba(253, 148, 109, 1)",//
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 1,
            data: this.data,
            spanGaps: false,
          }
        ]
      }
    };
    new Chart(this.lineCanvas.nativeElement, options);
  }
  loadMap() {
    let center = new google.maps.LatLng(0, 0);
    let mapOptions = {
      center: center,
      zoom: 30 ,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let positions:string;
    console.log(this.activityArray[this.activityArray.length-1]);
    positions = this.activityArray[this.activityArray.length-1].tracking;
    let topsp = this.activityArray[this.activityArray.length-1].topspeed;
    let minsp = this.activityArray[this.activityArray.length-1].minspeed;

    // for (let i = 0; i < positions.length-1; i++) {
    //   let startingPoint = positions[i];
    //   let endingPoint = positions[i + 1];

    //   let startPos = new google.maps.LatLng(startingPoint[0], startingPoint[1]);
    //   let endPos = new google.maps.LatLng(endingPoint[0], endingPoint[1]);

    //   console.log(startPos);
    //   console.log(endPos);
      
    //   let line = new google.maps.Polyline({
    //     path: [startPos,endPos],        
    //     geodesic: true,
    //     strokeColor: this.getcolor(startingPoint,endingPoint,topsp,minsp),
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2,
    //     map: map
    //   });
    // }

    console.log(positions[0]);
    console.log(positions[positions.length-1]);
    var posStart = new google.maps.LatLng(positions[0][0],positions[0][1]);
    var markerStart = new google.maps.Marker({ position: posStart, title: "start", icon:"assets/icon/posstart.png"});
    markerStart.setMap(map);
    map.setCenter({lat:positions[0][0], lng:positions[0][1], alt:0});

    var posEnd = new google.maps.LatLng(positions[positions.length-1][0],positions[positions.length-1][1]);
    var markerEnd = new google.maps.Marker({ position: posEnd, title: "end", icon: "assets/icon/posend.png"});
    markerEnd.setMap(map);
  }
  getcolor(startpos,endpos,top,min){
    let sp = this.distance(startpos[0],startpos[1],endpos[0],endpos[1],'K');
    sp = sp*3600;
    console.log("Speed" + sp);
    let r = 0 + Math.round(255*((sp-min)/((top-min)/2)));
    r = Math.min(r, 255);   //not more than 255
    r = Math.max(r, 0); 
    let strR =r.toString(16);
    if (strR.length < 2) {
        strR = "0" + strR;
    }
    let g = 177;
    if(sp>((top+min)/2)){
       g = 255 + Math.round((-255)*((sp-min)-(top-min)/2)/((top-min)/2));
    }
    else{
      g = 177 + Math.round(177*(sp-min)/((top-min)/2));
    }
    
    g = Math.min(g, 255);   //not more than 255
    g = Math.max(g, 0);
    let strG =g.toString(16);
    if (strG.length < 2) {
        strG = "0" + strG;
    }

    let b = 0;
    b = Math.min(b, 255);   // not more than 255
    b = Math.max(b, 0); 
    let strB =b.toString(16);
    if (strB.length < 2) {
        strB = "0" + strB;
    }

    console.log('#'+strR+strG+strB);
    return '#'+strR+strG+strB;
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    // console.log(lat1 + ":" + lon1 +"=" +lat2 + ":" + lon2 );
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    // console.log(dist);
    return dist
  }
}
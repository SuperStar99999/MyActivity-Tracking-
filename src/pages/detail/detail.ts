import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Activities, Users } from '../../providers/providers';
import { Activity } from '../../models/activity';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  @ViewChild('lineCanvas') lineCanvas;

  activityArray: Activity[] = [];
  totalDistance: number;
  totalTime: number;
  totalKcal: number;
  maxSpeed: number;
  heartRate: number;
  maxHeartRate: number;
  maxAltitude : number;
  data: number[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public activitise: Activities,
    public users: Users) {

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
      this.loadChart();
    });
  }
  ionViewDidLoad() {
    this.getValues();
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
}

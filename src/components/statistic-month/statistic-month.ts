import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Platform } from 'ionic-angular';
import { Activities, Users } from '../../providers/providers';
import { Activity } from '../../models/activity';

/*
  Generated class for the StatisticDetail2 component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'statistic-month',
  templateUrl: 'statistic-month.html'
})
export class StatisticMonthComponent {
  @ViewChild('lineCanvas') lineCanvas;
  text: string;

  activityArray: Activity[] = [];
  totalDistance: number;
  totalTime: number;
  totalKcal: number;
  maxSpeed: number;
  heartRate: number;
  maxHeartRate: number;
  maxAltitude : number;
  data: number[] = [];

  constructor(
      public platform: Platform,
      public activitise: Activities,
      public users: Users) {
    platform.ready().then(() => {
      this.getValues();
    });
  }
  getValues() {
    this.activitise.getMonth(this.users.uid).subscribe(activities => {
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
  loadChart() {
    var options = {
      type: 'line',
      data: {
        // labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
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

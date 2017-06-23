import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  is_sensor_connected = false;
  city_name = "ShenYang";
  constructor() {
    this.is_sensor_connected = false;
    this.city_name = "ShenYang";
  }

  setSensorConnection(flag) {
    this.is_sensor_connected = flag;
  }

  getSensorConnection() {
    return this.is_sensor_connected;
  }

}
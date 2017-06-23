import { Component, Input } from '@angular/core';

/*
  Generated class for the HItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'h-item',
  templateUrl: 'h-item.html'
})
export class HItemComponent {
  private _type: string;
  @Input()
  set type(type: string) {
    this._type = '<no caption set>';
    this._type = (type && type.trim()) || '<no caption set>';
  }
  get type(): string { return this._type; }

  private _caption: string;
  @Input()
  set caption(caption: string) {
    this._caption = '<no caption set>';
    this._caption = (caption && caption.trim()) || '<no subcaption set>';
  }
  get caption(): string { return this._caption; }

  private _date: string;
  @Input()
  set date(date: string) {
    this._date = (date && date.trim()) || '<no icon set>';
  }
  get date(): string { return this._date; }

  private _time: string;
  @Input()
  set time(time: string) {
    this._time = time;
  }
  get time(): string { return this._time; }

  private _location: string;
  @Input()
  set location(location: string) {
    this._location = (location && location.trim()) || '<no icon set>';
  }
  get location(): string { return this._location; }

  private _weather: string;
  @Input()
  set weather(weather: string) {
    this._weather = '<no caption set>';
    this._weather = (weather && weather.trim()) || '<no caption set>';
  }
  get weather(): string { return this._weather; }

  private _distance: string;
  @Input()
  set distance(distance: string) {
    this._distance = distance;
  }
  get distance(): string { return this._distance; }
}

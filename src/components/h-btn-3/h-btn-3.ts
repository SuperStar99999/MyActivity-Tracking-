import { Component, Input } from '@angular/core';

/*
  Generated class for the HBtn3 component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'h-btn-3',
  templateUrl: 'h-btn-3.html'
})
export class HBtn3Component {
  private _caption: string;
  private _subcaption: string;
  private _icon: string;

  @Input()
  set caption(caption: string) {
    this._caption = '<no caption set>';
    this._caption = (caption && caption.trim()) || '<no caption set>';
  }
  get caption(): string { return this._caption; }

  @Input()
  set subcaption(subcaption: string) {
    this._subcaption = '<no caption set>';
    this._subcaption = (subcaption && subcaption.trim()) || '<no subcaption set>';
  }
  get subcaption(): string { return this._subcaption; }

  @Input()
  set icon(icon: string) {
    this._icon = (icon && icon.trim()) || '<no icon set>';
  }
  get icon(): string { return this._icon; }

  constructor() {
  }
}

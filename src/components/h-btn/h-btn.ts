import { Component, Input } from '@angular/core';

@Component({
  selector: 'h-btn',
  templateUrl: 'h-btn.html'
})
export class HBtnComponent {
  private _caption: string;
  private _icon: string;

  @Input()
  set caption(caption: string) {
    this._caption = '<no caption set>';
    this._caption = (caption && caption.trim()) || '<no caption set>';
  }
  get caption(): string { return this._caption; }

  @Input()
  set icon(icon: string) {
    this._icon = (icon && icon.trim()) || '<no icon set>';
  }
  get icon(): string { return this._icon; }

  constructor() {
  }
}

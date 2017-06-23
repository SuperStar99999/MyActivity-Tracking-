import { Component, Input } from '@angular/core';

@Component({
  selector: 'item',
  templateUrl: 'item.html'
})
export class ItemComponent {
  private _count: number;
  private _caption: string;
  private _activate: boolean;
  @Input()
  set count(caption: number) {
    this._count = 0;
    this._count = (caption) || 0;
  }
  get count(): number { return this._count; }


  @Input()
  set caption(caption: string) {
    this._caption = '<no caption set>';
    this._caption = (caption && caption.trim()) || '<no caption set>';
  }
  get caption(): string { return this._caption; }
  @Input()
  set activate(activate: boolean) {
    this._activate = activate;
  }
  get activate() : boolean { return this._activate; }
}

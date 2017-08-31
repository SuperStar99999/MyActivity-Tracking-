import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class ActivityFilter {
 
    items: any;
 
    constructor(public http: Http) {
 
        this.items = [
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Laufen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Schwimmen'},
            {first:'A', icon:"assets/icon/favoron.png", favor:false, title: 'Aerobic'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'American Football'},
            {first:'B', icon:"assets/icon/favoron.png", favor:false, title: 'Badminton'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Baseball'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Basketball '},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Biathlon'},
            {first:'C', icon:"assets/icon/favoron.png", favor:false, title: 'Cross-Skating'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Crossfit'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Curling'},
            {first:'E', icon:"assets/icon/favoron.png", favor:false, title: 'Eishockey'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Eislaufen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Ellipsentrainer'},
            {first:'F', icon:"assets/icon/favoron.png", favor:false, title: 'Frisbee'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Fussball'},
            {first:'G', icon:"assets/icon/favoron.png", favor:false, title: 'Gehen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Golfen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Gymnastik'},
            {first:'H', icon:"assets/icon/favoron.png", favor:false, title: 'Handball'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Handbinking'},
            {first:'I', icon:"assets/icon/favoron.png", favor:false, title: 'Inlineskaten'},
            {first:'K', icon:"assets/icon/favoron.png", favor:false, title: 'Kajaking'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Kampfsport'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Kitesurfen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Klettern'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Kraftraining'},
            {first:'L', icon:"assets/icon/favoron.png", favor:false, title: 'Langlaufen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Laufen'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Laufen (Laufband)'},
            {first:'M', icon:"assets/icon/favoron.png", favor:false, title: 'Motorradfahren'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Mountainbiken'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Walking'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Running'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Jogging'},
            {first:'', icon:"assets/icon/favoron.png", favor:false, title: 'Swimming'}
        ] 
    }
    initStatus(type_list){
        for(let i = 0; i < this.items.length;i++){
            for(let j = 0; j < type_list.length; j ++)
            if(this.items[i].title == type_list[j]){
                this.items[i].favor = !this.items[i].favor;
            }
        }
    }
    setStatus(title_key){
        for(let i = 0; i < this.items.length;i++){
            if(this.items[i].title == title_key){
                this.items[i].favor = !this.items[i].favor;
            }
        }
    }
    filterItems(searchTerm){ 
        return this.items.filter((item) => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }); 
    }
 
}
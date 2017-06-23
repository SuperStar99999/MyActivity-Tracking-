import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, reorderArray } from 'ionic-angular';
import { Users } from '../../providers/users';
import { ActivityFilter } from '../../providers/activity-filter';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

/*
  Generated class for the Favorite page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favorlist',
  templateUrl: 'favorlist.html'
})
export class FavorlistPage {
  userProfile: any;
  favorList: any;
  activityList: any;
  search_key = "";
  searchControl: FormControl;
  searching: any = false;
  zone: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public activityFilter: ActivityFilter,
    public users: Users) {
    this.searchControl = new FormControl();
    this.userProfile = this.users.getCurrentUser();
    this.favorList = this.userProfile.favor;
    console.log(this.favorList);
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ionViewDidLoad() {
    this.setFilteredItems();
    this.activityFilter.initStatus(this.favorList);
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  reorderItems(indexes) {
    this.favorList = reorderArray(this.favorList, indexes);
    this.userProfile.favor = this.favorList;
    this.update();
  }
  delItem(index) {
    this.zone.run(() => {
      console.log(index);
      this.activityFilter.setStatus(this.favorList[index]);
      this.favorList.splice(index, 1);
      this.userProfile.favor = this.favorList;
      this.update();
    });
  }
  setFilteredItems() {
    this.activityList = this.activityFilter.filterItems(this.search_key);
    // git test
  }
  addType(index) {
    if (this.favorList.length < 5) {
      for (let i = 0; i < this.favorList.length; i++) {
        if (this.favorList[i] == this.activityList[index].title) {
          return;
        }
      }
      console.log(this.activityList[index].title);
      this.zone.run(() => {
        this.favorList.push(this.activityList[index].title);
        this.activityFilter.setStatus(this.activityList[index].title);
        this.userProfile.favor = this.favorList;
        this.update();
      });
    }
  }
  update() {
    this.users.updateProfile(this.userProfile);
  }
}

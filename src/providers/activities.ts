import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { Activity } from '../models/activity';

@Injectable()
export class Activities {
  constructor(
    public af: AngularFire
  ) {

  }

  query(params?: any) {
  }

  add(item: Activity, userId: string, tracking: any, bpms: any) {
    const relative1 = this.af.database.list('/trackings/' + userId);
    let data = {
      tracking: [],
      bpms: []
    }
    data.tracking = tracking;
    data.bpms = bpms;
    relative1.push(data).then((snap) => {
      item.tracking = snap.key;
      // console.log(item);
      const relative2 = this.af.database.list('/activities/' + userId);
      relative2.push(item).then;
    });
  }

  deleteFromList(userId: string, key: string) {
    const relative = this.af.database.list('/activities/' + userId);
    relative.remove(key);
  }
  
  getAll(userId: string) {
    return this.af.database.list('/activities/' + userId);
  }
  getYear(userId: string) {
    return this.af.database.list('/activities/' + userId);
  }
  getMonth(userId: string) {
    return this.af.database.list('/activities/' + userId);
  }
  getWeek(userId: string) {
    return this.af.database.list('/activities/' + userId);
  }

  getTracking(activityId: string){
    return this.af.database.list('/trackings/' + activityId);
  }
}

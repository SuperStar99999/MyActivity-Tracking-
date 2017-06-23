
export class Activity {
    time: number;
    distance: number;
    altitude: number;
    speed: number;
    meanspeed:number;
    topspeed:number;
    minspeed:number;
    pace: number;
    kcal: number;
    timestamp: number;
    city:string;
    tracking :string;
    type:string;
    bpm: number;
    // bpms :string;
    constructor() {
        this.time = 0;
        this.distance = 0;
        this.altitude = 0;
        this.speed = 0;
        this.meanspeed = 0;
        this.topspeed = 0;
        this.minspeed = 0;
        this.pace = 0;
        this.kcal = 0;
        this.timestamp = Date.now();
        this.city = "";
        this.tracking = "";
        this.type = "";
        this.bpm = 0;
    }
}

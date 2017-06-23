import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MediaPlugin } from 'ionic-native';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PlayerProvider {
    file: any;
    public url: String;
    public isPlaying: Boolean = false;
    isPlaylist: Boolean;
    isRepeat: Boolean;
    isShuffle: Boolean;
    duration: any;
    totalduration: any;
    storage = new Storage();
    currenttitle: any;
    paused: Boolean;
    playlist: { tracks: Array<any>, current: number };

    constructor() {
        this.currenttitle = "Title";
        this.paused = false;
        this.updateTimer();
        this.storage.get('playlist')
            .then(playlist => {
                if (playlist === null) {
                    this.playlist = { tracks: [], current: null }
                } else {
                    this.playlist = JSON.parse(playlist);
                }
            });
    }

    play(url?, isPlaylist = false) {
        this.isPlaylist = isPlaylist;
        // If file is already playing
        if (this.isPlaying) {
            this.stop();
        }
        // If a new file is given to play
        if (url) {
            this.initialize(url);
        }
        this.file.play();
        this.currenttitle = this.playlist.tracks[this.playlist.current].name;
        if (!this.paused)
        { 
            this.duration = 0;
        }
        if(this.paused)
        {
            this.paused = !this.paused;
        }
        this.isPlaying = true;
    }

    isFinished() {
        return this.file.init.then(() => {
            return this.isPlaying = false;
        });
    }

    initialize(file) {
        this.file = new MediaPlugin(file);
    }

    pause() {
        this.file.pause();
        this.isPlaying = false;
        this.paused = true;
    }

    stop() {
        if (this.file) {
            this.file.pause();
            // this.file.release();
        }
        this.isPlaying = false;
    }

    seekTo(seconds) {
        let milli = seconds * 1000;
        this.file.seekTo(milli);
        this.duration = seconds;
    }

    initializePlaylist() {
        this.storage.set('current', JSON.stringify({ type: 'playlist' }));
        if (!this.playlist.current) {
            this.playlist.current = 0;
        }
        let file = this.playlist.tracks[this.playlist.current].nativeURL;
        this.initialize(file);
        this.isPlaylist = true;

    }

    startPlaylist() {
        this.stop();
        this.initializePlaylist();
        this.play(null, true);
    }

    updateTimer() {
        // console.log("Timer");
        if (this.file != null) {
            if (this.isPlaying) {
                this.duration++;
                this.totalduration = this.file.getDuration();
                if ((this.file.getDuration() != -1) && (this.duration > this.file.getDuration())) {
                    this.next();
                }
            }
        }
        setTimeout(() => {
            this.updateTimer();
        }, 1000);
    }

    // getDuration() {
    //     let obs = Observable.interval(200).flatMap(value => {
    //         value = this.file.getDuration();
    //         return Observable.of(value);
    //     })
    //     .filter(value => value > 0)
    //     .take(1);
    //     return obs;
    // }

    getCurrentPosition() {
        return this.file.getCurrentPosition();
    }

    isAudio(ext) {
        let audioExt = ["mp3", "ogg", "amr", "wma", "wav", "m4a"];
        return audioExt.indexOf(ext) !== -1 ? true : false;
    }

    isVideo(ext) {
        let videoExt = ["mp4"];
        return videoExt.indexOf(ext) !== -1 ? true : false;
    }

    addToPlayList(file) {
        let index = this.playlist.tracks.map(value => value.nativeURL).indexOf(file.nativeURL);
        if (index < 0) {
            this.playlist.tracks.push(file);
            this.storage.set('playlist', JSON.stringify(this.playlist));
        } else {
            return -1;
        }
    }
    deleteTrack(playlist: any) {
        this.playlist = playlist;
        this.storage.set('playlist', JSON.stringify(this.playlist));
    }

    next() {
        if (this.playlist.current < this.playlist.tracks.length - 1) {
            this.stop();
            this.isPlaying = false;
            let nStep = 1;
            if (this.isShuffle) {
                nStep = Math.round(Math.random() * 10);
                console.log(nStep);
            }
            this.playlist.current += nStep;
            this.playlist.current = this.playlist.current % this.playlist.tracks.length;
            console.log(this.playlist.current);

            let url = this.playlist.tracks[this.playlist.current].nativeURL;
            this.play(url, true);
            this.isPlaying = true;
            this.storage.set('playlist', JSON.stringify(this.playlist));
        }
        else {
            if (this.isRepeat) {
                this.stop();
                this.playlist.current = 0;
                let url = this.playlist.tracks[this.playlist.current].nativeURL;
                this.play(url, true);
                this.isPlaying = true;
                this.storage.set('playlist', JSON.stringify(this.playlist));
            }
            else {
                this.isPlaying = false;
                return -1;
            }
        }
    }

    back() {
        if (this.playlist.current > 0) {
            this.stop();
            this.playlist.current--;
            let url = this.playlist.tracks[this.playlist.current].nativeURL;
            this.play(url, true);
            this.isPlaying = true;
            this.storage.set('playlist', JSON.stringify(this.playlist));
        }
        else {
            if (this.isRepeat) {
                this.stop();
                this.playlist.current = this.playlist.tracks.length - 1;
                let url = this.playlist.tracks[this.playlist.current].nativeURL;
                this.play(url, true);
                this.isPlaying = true;
                this.storage.set('playlist', JSON.stringify(this.playlist));
            }
            else {
                this.isPlaying = false;
                return -1;
            }
        }
    }

    getFileName() {
        let promise = new Promise((res, rej) => {
            if (this.isPlaylist) {
                let current = this.playlist.current;
                res(this.playlist.tracks[current].name);
            } else {
                this.storage.get('current')
                    .then(current => {
                        if (current) {
                            current = JSON.parse(current);
                            res(current.file.name);
                        } else {
                            res(null);
                        }

                    });
            }
        });

        return promise;
    }
}
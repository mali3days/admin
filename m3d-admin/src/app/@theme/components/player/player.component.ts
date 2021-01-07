import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import io from 'socket.io-client';

import { PlayerService, Track } from '../../../@core/utils/player.service';


@Component({
  selector: 'ngx-player',
  styleUrls: ['./player.component.scss'],
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnDestroy {
  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean;

  track: Track;
  socket;
  activeCue;
  currentTime;
  duration;
  player: HTMLAudioElement;
  shuffle: boolean;

  constructor(private playerService: PlayerService) {
    this.track = this.playerService.random();
    this.createSocket();
  }

  ngOnDestroy() {
    this.player.pause();
    this.player.src = '';
    this.player.load();
  }

  prev() {
    if (!this.player.loop) {
      if (this.shuffle) {
        this.track = this.playerService.random();
      } else {
        this.track = this.playerService.prev();
      }
    }

    this.reload();
  }

  next() {
    if (!this.player.loop) {
      if (this.shuffle) {
        this.track = this.playerService.random();
      } else {
        this.track = this.playerService.next();
      }
    }

    this.reload();
  }

  playPause() {
    if (this.player.paused) {
      this.player.play();
      this.socket.emit('play', true);
    } else {
      this.player.pause();
      this.socket.emit('play', false);
    }
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  toggleLoop() {
    this.player.loop = !this.player.loop;
  }

  setVolume(volume: number) {
    this.player.volume = volume / 100;

    this.socket.emit('volumechange', this.player.volume);
    console.log(this.player.volume);
  }

  getVolume(): number {
    return this.player.volume * 100;
  }

  setProgress(duration: number) {
    this.currentTime = this.duration * duration / 100;
    this.socket.emit('currentTime', this.currentTime);
  }

  getProgress(): number {
    // return this.player.currentTime / this.player.duration * 100 || 0;
    return this.currentTime / this.duration * 100 || 0;
  }

  private createSocket() {
    const socket = io('http://192.168.0.104:3000');
    this.player = new Audio();

    socket.on('connect', () => {
      console.log('socket is connected');
    });
    socket.on('activeCue', (data) => {
      console.log('activeCue', data);
      this.activeCue = data;
    });
    socket.on('disconnect', () => {
      console.log('socket is disconnected');
    });
    socket.on('time', (data) => {
      console.log(data);
      console.log('time is changed');
      this.currentTime = data.currentTime;
      this.duration = data.duration;
    });

    this.socket = socket;
  }

  private reload() {
    this.setTrack();
    this.player.play();
  }

  private setTrack() {
    this.player.src = this.track.url;
    this.player.load();
  }
}

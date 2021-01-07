import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as io from 'socket.io-client';
import { createPopper } from '@popperjs/core';

import videojs from './video.js';

@Component({
  selector: 'video-player',
  styleUrls: ['./video-player.component.scss'],
  template: `
    <div *ngIf="!isControlMode; else elseBlock">
      <video #target class="video-js vjs-default-skin" [ngStyle]="{'height':'300px', 'width':'600px'}" controls muted playsinline preload="none">
        <track id="trackk" kind="captions" src="http://192.168.0.104:5000/The Lord of the Rings - The Fellowship of the Ring - Extended.vtt" srclang="en" label="English" default>
      </video>
      <div style="display:inline-block; margin-top: 50px">
        <div id="popover"></div>
      </div>
      Content to render when isControlMode is false.
    </div>
    <ng-template #elseBlock>
      <nb-card size="giant">
        <ngx-player [collapsed]="false"></ngx-player>
        <!-- <ngx-player [collapsed]="isCollapsed() && breakpoint.width <= breakpoints.md"></ngx-player> -->
      </nb-card>
      <!-- <nb-card class="actions-card">
        <nb-card-header>Action Groups</nb-card-header>
        <nb-card-body>
          <nb-actions size="medium">

            <nb-action>
              <nb-icon icon="play" pack="fa"></nb-icon>
            </nb-action>

            <nb-action>
              <nb-icon icon="pause" pack="fa"></nb-icon>
            </nb-action>

            <nb-action>
              <nb-icon icon="fa-volume-mute" pack="fa"></nb-icon>
            </nb-action>

            <nb-action icon="search-outline"></nb-action>
            <nb-action icon="email-outline"></nb-action>
            <nb-action disabled icon="bell-outline"></nb-action><nb-action>
            <nb-user name="Han Solo"></nb-user>
          </nb-action>
            <nb-action icon="settings-2-outline"></nb-action>
          </nb-actions>
        </nb-card-body>
      </nb-card> -->
    </ng-template>
    <button nbButton status="primary" size="small" (click)="changeControlMode(!isControlMode)">
      <div *ngIf="!isControlMode; else controlBlockText">Take control</div>
      <ng-template #controlBlockText>
        Stop control
      </ng-template>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent  implements AfterViewInit, OnDestroy  {
  @ViewChild('target') target: ElementRef;
  // see options: https://github.com/videojs/video.js/blob/master/docs/guides/options.md
  @Input() options: {
      fluid: boolean,
      aspectRatio: string,
      autoplay: boolean,
      sources: {
          src: string,
          type: string,
      }[],
  };
  player: videojs.Player;
  socket;
  popoverElement;
  isControlMode: boolean;

  constructor(
    private elementRef: ElementRef,
    // private popoverElement: HTMLElement,
  ) {
    this.isControlMode = false;
  }

  changeControlMode(mode) {
    console.log('new mode: ', mode);
    this.isControlMode = mode;

    console.log(this.isControlMode);
    if (!this.isControlMode) {
      setTimeout(() => {
        this.setupComponent();
      })
    }
  }

  setupComponent() {
    console.log('setupComponent')
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });

    this.player.on('timeupdate', (data) => {
      console.log(data);

      const currentTime = this.player.currentTime();
      const duration = this.player.duration();

      this.socket.emit('time', { duration, currentTime }, response =>
        console.log('time was send:', response),
      );
    });

    this.setupSocketConnection();
    this.setupTrack();
  }

  // TODO: Delete or use
  ngAfterViewInit() {
    this.setupComponent();
  }

  setupSocketConnection() {
    this.socket = io('http://192.168.0.104:3000');

    this.socket.on('connect', function() {
      console.log('Connected');
    });
    this.socket.on('events', function(data) {
      console.log('event', data);
    });
    this.socket.on('play', (data) => {
      console.log('play: ', data);

      if (data && this.player) {
        this.player.play();
      } else if (this.player) {
        this.player.pause();
      }
    });
    this.socket.on('exception', function(data) {
      console.log('event', data);
    });
    this.socket.on('disconnect', function() {
      console.log('Disconnected');
    });

    this.socket.on('volumechange', (data) => {
      console.log('socket volumechange', data);
      this.player.volume(data);
    });

    this.socket.on('currentTime', (data) => {
      console.log('socket currentTime', data);
      this.player.currentTime(data);
    });

    // TODO: WIP
    // player1.on('volumechange', () => {
    //   player2.volume(player1.volume())
    // })
  }

  setupTrack() {
    var subss = document.querySelector('.vjs-text-track-display')
    this.popoverElement = document.getElementById('popover');

    subss.addEventListener('click', async (e) => {
      const element = e.target as HTMLElement;

        if (element.classList.contains('word')) {
        const id = element.id;

        console.log('word:', element.innerText);

        this.player.pause();

        const translateApi = `http://192.168.0.132:5000/translate?text=${element.innerText}`;
        const options = {
            method: 'GET',
            mode: 'cors',
        };

        const response = await fetch(translateApi, options).then(res => res.json());

        const wordElement = document.getElementById(id);
        const wordElementFontSize = getComputedStyle(wordElement).fontSize;

        this.popoverElement.style.fontSize = wordElementFontSize;
        this.popoverElement.innerText = response.translated;

        const popperInstance = createPopper(wordElement, this.popoverElement, {
          placement: 'top',
        });

        this.player.el().appendChild(this.popoverElement);
        }
    });

    setTimeout(() => {
      var tracks = this.player.textTracks()[0];

      if (tracks) {
        tracks.addEventListener('cuechange', (e) => {
          const playerElement = this.player.el();

          if (playerElement.contains(this.popoverElement)) {
            playerElement.removeChild(this.popoverElement);
          }

          const activeCue = this.player.textTracks()[0].activeCues[0];

          if (activeCue) {
            this.socket.emit('activeCue', activeCue.text, response =>
              console.log('activeCueWasSend:', response),
            );
          } else {
            console.log('no cue text');
            this.socket.emit('activeCue', '', response =>
              console.log('empty CueWasSend:', response),
            );
          }
        });
      }
    }, 1000)
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }

}

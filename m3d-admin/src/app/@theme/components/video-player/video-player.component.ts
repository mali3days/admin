import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as io from 'socket.io-client';
import { createPopper } from '@popperjs/core';

import videojs from './video.js';

@Component({
  selector: 'video-player',
  styleUrls: ['./video-player.component.scss'],
  template: `
    <video #target class="video-js vjs-default-skin" [ngStyle]="{'height':'300px', 'width':'600px'}" controls muted playsinline preload="none">
      <track id="trackk" kind="captions" src="http://localhost:5000/The Lord of the Rings - The Fellowship of the Ring - Extended.vtt" srclang="en" label="English" default>
    </video>
    <div style="display:inline-block; margin-top: 50px">
      <div id="popover"></div>
    </div>
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

  constructor(
    private elementRef: ElementRef,
    // private popoverElement: HTMLElement,
  ) { }

  ngAfterViewInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });

    this.setupSocketConnection();
    this.setupTrack();
  }

  setupSocketConnection() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', function() {
      console.log('Connected');
    });
    this.socket.on('events', function(data) {
      console.log('event', data);
    });
    this.socket.on('play', (data) => {
      console.log('data: ', data);

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

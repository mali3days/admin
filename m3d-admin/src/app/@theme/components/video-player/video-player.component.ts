import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';

import videojs from './video.js';
import { createPopper } from '@popperjs/core';


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
  // [[translatedText]]
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
  popoverElement;

  constructor(
    private elementRef: ElementRef,
    // private popoverElement: HTMLElement,
  ) { }

  ngAfterViewInit() {
    // instantiate Video.js
    console.log('ngAfterViewInit!!!');
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });

    this.setupTrack();
  }

  setupTrack() {
    var subss = document.querySelector('.vjs-text-track-display')
    this.popoverElement = document.getElementById('popover');

    subss.addEventListener('click', async (e) => {
      const element = e.target as HTMLElement;

      console.log(e);
      console.log(element);
        if (element.classList.contains('word')) {
        console.log('event: ', e);
        console.log('id: ', element.id);
        const id = element.id;

        console.log('word:', element.innerText);

        this.player.pause();

        const translateApi = `http://192.168.0.106:5000/translate?text=${element.innerText}`;
        const options = {
            method: 'GET',
            mode: 'cors',
        };
        const translateText = 'MOCK TRANSLATE';
        // const translateText = await fetch(translateApi, options).then(res => res.json());

        const wordElement = document.getElementById(id);
        const wordElementFontSize = getComputedStyle(wordElement).fontSize;

        this.popoverElement.style.fontSize = wordElementFontSize;

        console.log(translateText);

        this.popoverElement.innerText = translateText;

        // this.set('translatedText', translateText.translated);
        // this.set('wordId', id);

        const popperInstance = createPopper(wordElement, this.popoverElement, {
          placement: 'top',
        });

        this.player.el().appendChild(this.popoverElement);

        // TODO: delete comment
        // console.log(popperInstance);
        }
    });

    setTimeout(() => {
      var tracks = this.player.textTracks().tracks_[1];

      if (tracks) {
        tracks.addEventListener('cuechange', (e) => {
          console.log('CUE CHANGED: ', e)
          // this.set('translatedText');
          // this.set('wordId');
          const playerElement = this.player.el();

          if (playerElement.contains(this.popoverElement)) {
            playerElement.removeChild(this.popoverElement);
          }

          const activeCue = this.player.textTracks()[1].activeCues[0];

          if (activeCue) {
            // console.log(activeCue.text)
            // socket.emit('activeCue', activeCue.text, response =>
            //   console.log('activeCueWasSend:', response),
            // );
          } else {
            console.log('no cue text');
          }
          // this.set('activeCue', activeCue);
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

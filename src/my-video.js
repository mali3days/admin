import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
// import { createPopper } from '@popperjs/core';
import { createPopper } from "@popperjs/core/dist/esm/popper";

import './shared-styles.js';
import '../video';
import './lib/jquery.min';
import './lib/qrcode';

import { uuidv4 } from "@bundled-es-modules/uuid/index.js";

class Video extends PolymerElement {
  static get properties() {
    return {
      activeCue: Object,
      player: Object,
      wordId: String,
      translatedText: String,
    };
  }

  constructor() {
    super();

    this.translatedText = 'OPA';
  }

  static get template() {
    return html`
      <link
        href="https://unpkg.com/video.js@7/dist/video-js.css"
        rel="stylesheet"
      />
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }

        .vjs-text-track-display {
          pointer-events: auto !important;
        }
          
        .audio_play_button:hover {
            border: 1px solid #ccc;
            color: #000;
        }
        
        .vjs-subs .word {
            cursor: pointer;
            border-bottom: 1px dotted #fff;
        }
        
        .vjs-subs .word:hover {
            color: white;
            background-color: #4285f4 !important;
            text-decoration: none;
        }

        #popover {
          background: red;
          border-radius: 2px;
          padding: 3px;
          bottom: 4px !important;
          color: white;
        }

        /* TODO: check if it's works !*/
        #popper[data-popper-reference-hidden] {
          visibility: hidden;
          pointer-events: none;
        }

        /* TODO: check if it's works !*/
        #popper[data-popper-escaped] {
          visibility: hidden;
          pointer-events: none;
        }

        video {
          height: 100% !important;
        }
        
        #qrcode img {
          width: 140px;
        }
      </style>
      <div class="card">
        <video-js id="vid1" style="height: 300px" width="600" height="300" class="vjs-default-skin" controls>
          <source
              id="my-video"
              class="video-js"
              controls
              preload="auto"
              width="640"
              height="264"
              poster="MY_VIDEO_POSTER.jpg"
              data-setup="{}"
            src="../demo/demo.m3u8"
            type="application/x-mpegURL">
            <track id="trackk" kind="captions" src="The Lord of the Rings - The Fellowship of the Ring - Extended.vtt" srclang="en" label="English" default>
        </video-js>
        <div style="display:inline-block; margin-top: 50px">
          <div id="popover">[[translatedText]]</div>
        </div>
        <div>wordId: [[wordId]]</div>
        <div>translatedText: [[translatedText]]</div>
        <div>activeCue: [[activeCue.text]]</div>
        <div id="qrcode"></div>
      </div>
    `;
  }

  socketConnection() {
    const socket = io('http://localhost:3000');
    console.log(socket);

    socket.on('connect', function() {
      console.log('Connected');
    });
    socket.on('events', function(data) {
      console.log('event', data);
    });
    socket.on('play', (data) => {
      console.log('data: ', data);

      if (data) {
        this.player.play();
      } else {
        this.player.pause();
      }

    });
    socket.on('exception', function(data) {
      console.log('event', data);
    });
    socket.on('disconnect', function() {
      console.log('Disconnected');
    });

    return socket;
  }

  ready() {
    // Socket connection things
    const socket = this.socketConnection();

    // socket.emit('events', { test: 'test' });
    // socket.emit('identity', 0, response =>
    //   console.log('Identity:', response),
    // );

    super.ready();

    const qrCodePlacement = this.shadowRoot.getElementById("qrcode")
    const videojsElement = this.shadowRoot.getElementById('vid1');
    const popoverElement = this.shadowRoot.getElementById('popover');
    
    const uniqID = uuidv4();
    console.log(uniqID);

    new QRCode(qrCodePlacement, `http://127.0.0.1:8081/video?uniqId=${uniqID}`);

    var player = videojs(videojsElement, {
      html5: {
          autoplay: true,
          nativeTextTracks: false
      }
    });

    this.set('player', player);


    document.player = player;
    // let tracks = player.textTracks();
    var subss = this.shadowRoot.querySelector('.vjs-text-track-display')
    subss.addEventListener('click', async (e) => {
        if (e.target.classList.contains('word')) {
        console.log('event: ', e);
        console.log('id: ', e.target.id);
        const id = e.target.id;

        console.log('word:', e.target.innerText);

        player.pause();

        const translateApi = `http://192.168.0.106:5000/translate?text=${e.target.innerText}`;
        const options = {
            method: 'GET',
            mode: 'cors',
        };
        const translateText = await fetch(translateApi, options).then(res => res.json());

        const wordElement = this.shadowRoot.getElementById(id);
        const wordElementFontSize = getComputedStyle(wordElement).fontSize;

        popoverElement.style.fontSize = wordElementFontSize;

        console.log(translateText);

        this.set('translatedText', translateText.translated);
        this.set('wordId', id);

        const popperInstance = createPopper(wordElement, popoverElement, {
          placement: 'top',
        });

        player.el().appendChild(popoverElement);

        // TODO: delete comment
        // console.log(popperInstance);
        }
    });

    setTimeout(() => {
      var tracks = player.textTracks().tracks_[1];

      if (tracks) {
        tracks.addEventListener('cuechange', (e) => {
          console.log('CUE CHANGED: ', e)
          this.set('translatedText');
          this.set('wordId');
          const playerElement = player.el();
          
          if (playerElement.contains(popoverElement)) {
            playerElement.removeChild(popoverElement);
          }
          
          const activeCue = player.textTracks()[1].activeCues[0];

          if (activeCue) {
            // console.log(activeCue.text)
            socket.emit('activeCue', activeCue.text, response =>
              console.log('activeCueWasSend:', response),
            );
          } else {
            console.log('no cue text');
          }
          this.set('activeCue', activeCue);
        });
      }
    }, 1000)

    
  }
}

window.customElements.define('my-video', Video);

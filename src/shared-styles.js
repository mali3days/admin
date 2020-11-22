/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      .card {
        margin: 24px;
        padding: 16px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .circle {
        display: inline-block;
        width: 64px;
        height: 64px;
        text-align: center;
        color: #555;
        border-radius: 50%;
        background: #ddd;
        font-size: 30px;
        line-height: 64px;
      }

      h1 {
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
      }
      @font-face {
        font-family: 'VideoJS';
        src: url('https://vjs.zencdn.net/f/1/vjs.eot');
        src: url('https://vjs.zencdn.net/f/1/vjs.eot?#iefix') format('embedded-opentype'), 
          url('https://vjs.zencdn.net/f/1/vjs.woff') format('woff'),     
          url('https://vjs.zencdn.net/f/1/vjs.ttf') format('truetype');
      }
    
    .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before, .vjs-icon-pause:before {
        content: "\f103";
        font-family: 'VideoJS';
    }
    
    .video-js .vjs-mute-control .vjs-icon-placeholder:before, .vjs-icon-volume-high:before {
        content: "\f107";
        font-family: 'VideoJS';
    }
    
    .video-js .vjs-big-play-button .vjs-icon-placeholder:before, .video-js .vjs-play-control .vjs-icon-placeholder:before, .vjs-icon-play:before {
        content: "\f101";
        font-family: 'VideoJS';
    }
    
    .video-js .vjs-picture-in-picture-control .vjs-icon-placeholder:before, .vjs-icon-picture-in-picture-enter:before {
        content: "\f121";
        font-family: 'VideoJS';
    }
    
    
    
     .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before, .vjs-icon-fullscreen-enter:before {
        content: "\f108";
        font-family: 'VideoJS';
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

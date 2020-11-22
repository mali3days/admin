/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyView2 extends PolymerElement {
  static get properties() {
    return {
      activeCue: String,
      socket: Object,
    };
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <div class="circle">2</div>
        <h1>ActiveCue</h1>
        <p>[[activeCue]]</p>
        <button value="Click me" on-click="handlePlayClick">Play</button>
        <button value="Click me" on-click="handlePauseClick">Pause</button>
      </div>
    `;
  }

  handlePlayClick() {
    console.log('Play was clicked!');
    console.log(this.socket);

    this.socket.emit('play', true);
  }

  handlePauseClick() {
    console.log('Pause was clicked!');
    console.log(this.socket);

    this.socket.emit('play', false);
  }

  socketConnection() {
    const socket = io('http://localhost:3000');
    this.set('socket', socket);

    socket.on('connect', function() {
      console.log('view2 connected');
    });
    socket.on('activeCue', (data) => {
      console.log('activeCue', data);
      this.set('activeCue', data);
    });
    socket.on('disconnect', function() {
      console.log('view2 disconnected');
    });

    return socket;
  }

  ready() {
    super.ready();
    // Socket connection things
    const socket = this.socketConnection();

  }
}

window.customElements.define('my-view2', MyView2);

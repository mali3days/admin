import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
  
  @WebSocketGateway()
  export class EventsGateway {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('events')
    findAll(): Observable<WsResponse<number>> { // @MessageBody() data: any
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('activeCue')
    async identity(@MessageBody() data: string): Promise<boolean> {
      console.log('activeCue: ', data);

      this.server.emit('activeCue', data)

      return true;
    }

    @SubscribeMessage('play')
    async play(@MessageBody() data: boolean): Promise<boolean> {
      console.log('play: ', data);
      this.server.emit('play', data)

      return true;
    }

    @SubscribeMessage('volumechange')
    async volumechange(@MessageBody() data: boolean): Promise<boolean> {
      console.log('volumechange: ', data);
      this.server.emit('volumechange', data)

      return true;
    }

    @SubscribeMessage('time')
    async time(@MessageBody() data: boolean): Promise<boolean> {
      console.log('time: ', data);
      this.server.emit('time', data)

      return true;
    }

    @SubscribeMessage('currentTime')
    async currentTime(@MessageBody() data: boolean): Promise<boolean> {
      console.log('currentTime: ', data);
      this.server.emit('currentTime', data)

      return true;
    }
  }
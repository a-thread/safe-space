import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})


export class ChatService {

  constructor(private socket: Socket) { }

  sendChat(username: string, message: string) {
    // emits an object with username and message accessible calling chat[0] & chat[1]
    this.socket.emit('chat', username, message);
  }

  receiveChat() {
    return this.socket.fromEvent('chat');
  }

  receiveNickName() {
    return this.socket.fromEvent('send-nickname');
  }

  getUsers() {
    return this.socket.fromEvent('users');
  }
}

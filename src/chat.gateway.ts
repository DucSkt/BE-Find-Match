import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

const usersAwait = {};

@WebSocketGateway(3006, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // Redis
  // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  afterInit(server: any): any {}

  async handleConnection(client: Socket) {
    const emit = this.server;
    if (Object.keys(usersAwait).length === 0) {
      // add user to the stack, when no match is found
      usersAwait[client.id] = client.handshake?.query?.token;
    } else {
      // get the first user in stack
      const socketId = Object.keys(usersAwait)[0];
      delete usersAwait[socketId];

      // emit event
      emit.to(socketId).emit('war', { status: 'ready' });
      emit.to(client.id).emit('war', { status: 'ready' });
    }
  }

  async handleDisconnect(client: Socket) {
    // remove the user from the stack when the user cancels or disconnects
    delete usersAwait[client.id];
  }
}

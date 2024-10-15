// File: backend/src/infrastructure/status-tracking/status.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { StatusService } from './status.service';

@WebSocketGateway()
export class StatusGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly statusService: StatusService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  updateStatus(id: string, status: string) {
    this.server.emit('statusUpdate', { id, status });
  }
}
